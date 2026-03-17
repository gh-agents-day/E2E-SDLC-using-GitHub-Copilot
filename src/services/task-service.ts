import Joi from 'joi';
import { Task, TaskDependency, StatusHistory } from '../models/types';
import { TaskRepository } from '../repositories/task-repository';
import { logger } from '../utils/logger';

/**
 * Validation schemas for task operations
 */
export const taskValidationSchemas = {
  create: Joi.object({
    title: Joi.string().required().max(200).messages({
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required',
    }),
    description: Joi.string().optional().max(2000).messages({
      'string.max': 'Description must not exceed 2000 characters',
    }),
    priority: Joi.string()
      .required()
      .valid('Low', 'Medium', 'High')
      .messages({
        'any.only': 'Priority must be one of: Low, Medium, High',
        'any.required': 'Priority is required',
      }),
    status: Joi.string()
      .required()
      .valid('ToDo', 'InProgress', 'Blocked', 'Completed')
      .messages({
        'any.only': 'Status must be one of: ToDo, InProgress, Blocked, Completed',
        'any.required': 'Status is required',
      }),
    assignedUserId: Joi.number().required().positive().messages({
      'number.positive': 'Assigned User ID must be a positive number',
      'any.required': 'Assigned User ID is required',
    }),
    estimatedCompletionDate: Joi.date()
      .required()
      .min('now')
      .messages({
        'date.min': 'Estimated completion date must be today or a future date',
        'any.required': 'Estimated completion date is required',
      }),
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .required()
      .valid('ToDo', 'InProgress', 'Blocked', 'Completed')
      .messages({
        'any.only': 'Status must be one of: ToDo, InProgress, Blocked, Completed',
        'any.required': 'Status is required',
      }),
    comment: Joi.string().optional().max(500).messages({
      'string.max': 'Comment must not exceed 500 characters',
    }),
  }),

  assign: Joi.object({
    assignedUserId: Joi.number().required().positive().messages({
      'number.positive': 'Assigned User ID must be a positive number',
      'any.required': 'Assigned User ID is required',
    }),
  }),

  addDependency: Joi.object({
    dependsOnTaskId: Joi.number().required().positive().messages({
      'number.positive': 'Depends on Task ID must be a positive number',
      'any.required': 'Depends on Task ID is required',
    }),
  }),
};

/**
 * Task Service
 * Implements business logic for task management
 */
export class TaskService {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  /**
   * Create a new task with validation
   * Validates input and enforces business rules
   */
  async createTask(
    taskData: {
      title: string;
      description?: string;
      priority: string;
      status: string;
      assignedUserId: number;
      estimatedCompletionDate: Date;
    },
    createdByUserId: number,
    requestId: string
  ): Promise<Task> {
    logger.info('Creating task', {
      requestId,
      title: taskData.title,
      priority: taskData.priority,
      assignedUserId: taskData.assignedUserId,
    });

    const task = await this.repository.createTask({
      ...taskData,
      createdByUserId,
    });

    // Record initial status in history
    await this.repository.recordStatusHistory({
      taskId: task.id,
      newStatus: task.status,
      changedByUserId: createdByUserId,
      comment: 'Task created',
    });

    logger.info('Task created successfully', {
      requestId,
      taskId: task.id,
      taskIdCode: task.taskIdCode,
    });

    return task;
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId: number, requestId: string): Promise<Task | null> {
    logger.debug('Fetching task', { requestId, taskId });
    return this.repository.getTaskById(taskId);
  }

  /**
   * Get all tasks with optional filtering
   */
  async getAllTasks(
    filters?: {
      status?: string;
      priority?: string;
      assignedUserId?: number;
      dueDateFrom?: Date;
      dueDateTo?: Date;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
    requestId?: string
  ): Promise<{ tasks: Task[]; total: number; page: number; pageSize: number }> {
    const requestIdVal = requestId || 'unknown';
    logger.debug('Fetching all tasks', { requestId: requestIdVal, filters });

    let tasks = await this.repository.getAllTasks();

    // Apply filters
    if (filters?.status) {
      tasks = tasks.filter((t) => t.status === filters.status);
    }
    if (filters?.priority) {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }
    if (filters?.assignedUserId) {
      tasks = tasks.filter((t) => t.assignedUserId === filters.assignedUserId);
    }
    if (filters?.dueDateFrom) {
      tasks = tasks.filter((t) => new Date(t.estimatedCompletionDate) >= filters.dueDateFrom!);
    }
    if (filters?.dueDateTo) {
      tasks = tasks.filter((t) => new Date(t.estimatedCompletionDate) <= filters.dueDateTo!);
    }

    // Apply sorting
    if (filters?.sortBy) {
      const sortBy = filters.sortBy as keyof Task;
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;

      tasks.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (aVal === undefined || bVal === undefined) return 0;
        if (aVal < bVal) return -1 * sortOrder;
        if (aVal > bVal) return 1 * sortOrder;
        return 0;
      });
    }

    // Apply pagination
    const page = filters?.page || 1;
    const pageSize = Math.min(filters?.pageSize || 20, 100); // Max 100 per page
    const start = (page - 1) * pageSize;
    const paginatedTasks = tasks.slice(start, start + pageSize);

    logger.debug('Tasks fetched', {
      requestId: requestIdVal,
      total: tasks.length,
      returned: paginatedTasks.length,
      page,
      pageSize,
    });

    return {
      tasks: paginatedTasks,
      total: tasks.length,
      page,
      pageSize,
    };
  }

  /**
   * Update task status with business rule validation
   * Enforces dependency blocking rules per TSD 5.6.1
   */
  async updateTaskStatus(
    taskId: number,
    newStatus: string,
    comment: string | undefined,
    changedByUserId: number,
    requestId: string
  ): Promise<Task> {
    logger.info('Updating task status', {
      requestId,
      taskId,
      newStatus,
    });

    // Get current task
    const task = await this.repository.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const oldStatus = task.status;

    // Validate allowed status transitions
    const allowedTransitions: Record<string, string[]> = {
      ToDo: ['InProgress', 'Blocked'],
      InProgress: ['ToDo', 'Blocked', 'Completed'],
      Blocked: ['ToDo', 'InProgress'],
      Completed: ['ToDo', 'InProgress'],
    };

    if (!allowedTransitions[oldStatus]?.includes(newStatus)) {
      const err = new Error(
        `Invalid status transition from ${oldStatus} to ${newStatus}`
      ) as any;
      err.statusCode = 422;
      err.code = 'INVALID_STATUS_TRANSITION';
      throw err;
    }

    // Business Rule: Check if task should be blocked due to dependencies
    if (newStatus !== 'Blocked') {
      const dependencies = await this.repository.getDependencies(taskId);
      const hasUncompletedDependencies = await this.hasPendingDependencies(dependencies);

      if (hasUncompletedDependencies && newStatus !== 'Blocked') {
        logger.warn('Attempted to change status of blocked task', {
          requestId,
          taskId,
          proposedStatus: newStatus,
        });
        // Automatically set to Blocked per BR-R-006
        logger.info('Auto-blocking task due to pending dependencies', {
          requestId,
          taskId,
        });
        newStatus = 'Blocked';
      }
    }

    // Update task
    const updatedTask = await this.repository.updateTask(taskId, {
      status: newStatus as any,
    });

    if (!updatedTask) {
      throw new Error(`Failed to update task ${taskId}`);
    }

    // Record status history
    await this.repository.recordStatusHistory({
      taskId,
      oldStatus: oldStatus as any,
      newStatus: newStatus as any,
      changedByUserId,
      comment,
    });

    logger.info('Task status updated', {
      requestId,
      taskId,
      oldStatus,
      newStatus,
    });

    // Auto-unblock tasks that depend on this task when it becomes Completed
    if (newStatus === 'Completed') {
      await this.tryUnblockDependentTasks(taskId, changedByUserId, requestId);
    }

    return updatedTask;
  }

  /**
   * Check if a task has pending (uncompleted) dependencies
   */
  private async hasPendingDependencies(dependencies: TaskDependency[]): Promise<boolean> {
    for (const dep of dependencies) {
      const dependsOnTask = await this.repository.getTaskById(dep.dependsOnTaskId);
      if (dependsOnTask && dependsOnTask.status !== 'Completed') {
        return true;
      }
    }
    return false;
  }

  /**
   * Get task's dependency list
   */
  async getTaskDependencies(taskId: number, requestId: string): Promise<TaskDependency[]> {
    logger.debug('Fetching task dependencies', { requestId, taskId });
    return this.repository.getDependencies(taskId);
  }

  /**
   * Get task's status history
   */
  async getTaskStatusHistory(taskId: number, requestId: string): Promise<StatusHistory[]> {
    logger.debug('Fetching task status history', { requestId, taskId });
    return this.repository.getStatusHistory(taskId);
  }

  /**
   * Assign (or reassign) a task to a user
   * Records previous assignee in history and logs a notification stub
   */
  async assignTask(
    taskId: number,
    assignedUserId: number,
    changedByUserId: number,
    requestId: string
  ): Promise<Task> {
    logger.info('Assigning task', { requestId, taskId, assignedUserId });

    const task = await this.repository.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const previousAssigneeId = task.assignedUserId;

    const updatedTask = await this.repository.updateTask(taskId, {
      assignedUserId,
      updatedByUserId: changedByUserId,
    });

    if (!updatedTask) {
      throw new Error(`Failed to update task ${taskId}`);
    }

    // Record assignment change in status history as a comment
    await this.repository.recordStatusHistory({
      taskId,
      oldStatus: task.status,
      newStatus: task.status,
      changedByUserId,
      comment: `Task reassigned from userId ${previousAssigneeId} to userId ${assignedUserId}`,
    });

    // Notification stub — log the reassignment event
    logger.info('[NOTIFICATION] Task reassignment event', {
      requestId,
      taskId,
      taskIdCode: updatedTask.taskIdCode,
      previousAssigneeId,
      newAssigneeId: assignedUserId,
      changedByUserId,
    });

    return updatedTask;
  }

  /**
   * Add a dependency between two tasks
   * Blocks the task if the prerequisite is not yet Completed
   */
  async addTaskDependency(
    taskId: number,
    dependsOnTaskId: number,
    createdByUserId: number,
    requestId: string
  ): Promise<TaskDependency> {
    logger.info('Adding task dependency', { requestId, taskId, dependsOnTaskId });

    // BR-R-005: No self-dependency
    if (taskId === dependsOnTaskId) {
      const err = new Error('A task cannot depend on itself') as any;
      err.statusCode = 422;
      err.code = 'SELF_DEPENDENCY';
      throw err;
    }

    const task = await this.repository.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const prerequisiteTask = await this.repository.getTaskById(dependsOnTaskId);
    if (!prerequisiteTask) {
      const err = new Error(`Prerequisite task ${dependsOnTaskId} not found`) as any;
      err.statusCode = 404;
      err.code = 'RESOURCE_NOT_FOUND';
      throw err;
    }

    // Check for duplicate dependency
    const existing = await this.repository.getDependencies(taskId);
    if (existing.some((d) => d.dependsOnTaskId === dependsOnTaskId)) {
      const err = new Error('This dependency already exists for the task') as any;
      err.statusCode = 409;
      err.code = 'DUPLICATE_DEPENDENCY';
      throw err;
    }

    // Check for circular dependency
    if (await this.wouldCreateCircularDependency(dependsOnTaskId, taskId)) {
      const err = new Error(
        'Cannot add dependency: this would create a circular dependency chain'
      ) as any;
      err.statusCode = 422;
      err.code = 'CIRCULAR_DEPENDENCY';
      throw err;
    }

    const dependency = await this.repository.addDependency({
      taskId,
      dependsOnTaskId,
      createdByUserId,
    });

    // Auto-block the task if prerequisite is not yet Completed
    if (prerequisiteTask.status !== 'Completed' && task.status !== 'Blocked') {
      await this.repository.updateTask(taskId, { status: 'Blocked' });
      await this.repository.recordStatusHistory({
        taskId,
        oldStatus: task.status,
        newStatus: 'Blocked',
        changedByUserId: createdByUserId,
        comment: `Automatically blocked: depends on task ${dependsOnTaskId} which is not yet Completed`,
      });
      logger.info('Task auto-blocked due to new dependency', { requestId, taskId, dependsOnTaskId });
    }

    return dependency;
  }

  /**
   * Remove a task dependency and re-evaluate blocked status
   */
  async removeTaskDependency(
    taskId: number,
    dependencyId: number,
    changedByUserId: number,
    requestId: string
  ): Promise<void> {
    logger.info('Removing task dependency', { requestId, taskId, dependencyId });

    const dependency = await this.repository.getDependencyById(dependencyId);
    if (!dependency || dependency.taskId !== taskId) {
      const err = new Error(`Dependency ${dependencyId} not found for task ${taskId}`) as any;
      err.statusCode = 404;
      err.code = 'RESOURCE_NOT_FOUND';
      throw err;
    }

    await this.repository.removeDependency(dependencyId);

    // Re-evaluate blocked status: unblock if no more pending dependencies
    const task = await this.repository.getTaskById(taskId);
    if (task && task.status === 'Blocked') {
      const remaining = await this.repository.getDependencies(taskId);
      const stillBlocked = await this.hasPendingDependencies(remaining);
      if (!stillBlocked) {
        await this.repository.updateTask(taskId, { status: 'ToDo' });
        await this.repository.recordStatusHistory({
          taskId,
          oldStatus: 'Blocked',
          newStatus: 'ToDo',
          changedByUserId,
          comment: `Automatically unblocked: dependency ${dependencyId} removed`,
        });
        logger.info('Task auto-unblocked after dependency removal', { requestId, taskId });
      }
    }
  }

  /**
   * Detect circular dependency: check if targetTaskId is an ancestor of startTaskId
   */
  private async wouldCreateCircularDependency(
    startTaskId: number,
    targetTaskId: number
  ): Promise<boolean> {
    const visited = new Set<number>();
    const queue = [startTaskId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === targetTaskId) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      const deps = await this.repository.getDependencies(current);
      for (const dep of deps) {
        queue.push(dep.dependsOnTaskId);
      }
    }
    return false;
  }

  /**
   * Auto-unblock tasks that depend on a newly completed task
   */
  private async tryUnblockDependentTasks(
    completedTaskId: number,
    changedByUserId: number,
    requestId: string
  ): Promise<void> {
    const dependentLinks = await this.repository.getTasksDependingOn(completedTaskId);
    for (const link of dependentLinks) {
      const dependentTask = await this.repository.getTaskById(link.taskId);
      if (!dependentTask || dependentTask.status !== 'Blocked') continue;

      const allDeps = await this.repository.getDependencies(link.taskId);
      const stillBlocked = await this.hasPendingDependencies(allDeps);
      if (!stillBlocked) {
        await this.repository.updateTask(link.taskId, { status: 'ToDo' });
        await this.repository.recordStatusHistory({
          taskId: link.taskId,
          oldStatus: 'Blocked',
          newStatus: 'ToDo',
          changedByUserId,
          comment: `Automatically unblocked: prerequisite task ${completedTaskId} completed`,
        });
        logger.info('Dependent task auto-unblocked', {
          requestId,
          dependentTaskId: link.taskId,
          completedTaskId,
        });
      }
    }
  }
}
