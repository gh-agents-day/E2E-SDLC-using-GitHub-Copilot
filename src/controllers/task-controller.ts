import { Request, Response, NextFunction } from 'express';
import { TaskService, taskValidationSchemas } from '../services/task-service';
import { TaskRepository } from '../repositories/task-repository';
import { ApiResponse } from '../models/types';
import { logger } from '../utils/logger';

/**
 * Task Controller
 * Handles HTTP requests for task management
 * Delegates business logic to TaskService
 */
export class TaskController {
  private taskService: TaskService;

  constructor() {
    const repository = new TaskRepository();
    this.taskService = new TaskService(repository);
  }

  /**
   * POST /api/v1/tasks
   * Create a new task
   */
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('POST /tasks - Create task request', {
        requestId: req.id,
        body: req.body,
      });

      // Validate request body
      const { error, value } = taskValidationSchemas.create.validate(req.body);
      if (error) {
        logger.warn('Task creation validation failed', {
          requestId: req.id,
          error: error.message,
        });

        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid task data',
            details: {
              validationErrors: error.details.map((d) => ({
                field: d.path.join('.'),
                message: d.message,
              })),
            },
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: req.id,
          },
        };
        res.status(400).json(response);
        return;
      }

      // Create task (using mock user ID for now)
      const createdByUserId = 1; // TODO: Extract from JWT token
      const task = await this.taskService.createTask(
        value,
        createdByUserId,
        req.id
      );

      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.id,
        },
      };

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/tasks
   * List all tasks with filtering and pagination
   */
  async getTasksList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('GET /tasks - List tasks request', {
        requestId: req.id,
        query: req.query,
      });

      // Parse query parameters
      const filters = {
        status: req.query.status as string | undefined,
        priority: req.query.priority as string | undefined,
        assignedUserId: req.query.assignedUserId
          ? parseInt(req.query.assignedUserId as string, 10)
          : undefined,
        dueDateFrom: req.query.dueDateFrom
          ? new Date(req.query.dueDateFrom as string)
          : undefined,
        dueDateTo: req.query.dueDateTo ? new Date(req.query.dueDateTo as string) : undefined,
        page: req.query.pageNumber ? parseInt(req.query.pageNumber as string, 10) : 1,
        pageSize: req.query.pageSize
          ? Math.min(parseInt(req.query.pageSize as string, 10), 100)
          : 20,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: ((req.query.sortOrder as string) || 'desc') as 'asc' | 'desc',
      };

      // Validate filters
      if (filters.status && !['ToDo', 'InProgress', 'Blocked', 'Completed'].includes(filters.status)) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: {
            code: 'INVALID_FILTER',
            message: 'Invalid status filter',
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: req.id,
          },
        };
        res.status(400).json(response);
        return;
      }

      // Get tasks
      const result = await this.taskService.getAllTasks(filters, req.id);

      const response: ApiResponse<typeof result.tasks> = {
        success: true,
        data: result.tasks,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.id,
          pagination: {
            page: result.page,
            pageSize: result.pageSize,
            total: result.total,
            totalPages: Math.ceil(result.total / result.pageSize),
          },
        },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/tasks/:id
   * Get a specific task by ID
   */
  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskId = parseInt(req.params.id, 10);

      logger.info('GET /tasks/:id - Get task request', {
        requestId: req.id,
        taskId,
      });

      // Validate task ID
      if (Number.isNaN(taskId) || taskId <= 0) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: {
            code: 'INVALID_TASK_ID',
            message: 'Task ID must be a positive integer',
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: req.id,
          },
        };
        res.status(400).json(response);
        return;
      }

      const task = await this.taskService.getTaskById(taskId, req.id);

      if (!task) {
        logger.warn('Task not found', {
          requestId: req.id,
          taskId,
        });

        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: `Task ${taskId} not found`,
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: req.id,
          },
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.id,
        },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/tasks/:id/status
   * Update task status with dependency checking
   */
  async updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskId = parseInt(req.params.id, 10);

      logger.info('PATCH /tasks/:id/status - Update status request', {
        requestId: req.id,
        taskId,
        body: req.body,
      });

      // Validate task ID
      if (Number.isNaN(taskId) || taskId <= 0) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: {
            code: 'INVALID_TASK_ID',
            message: 'Task ID must be a positive integer',
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: req.id,
          },
        };
        res.status(400).json(response);
        return;
      }

      // Validate request body
      const { error, value } = taskValidationSchemas.updateStatus.validate(req.body);
      if (error) {
        logger.warn('Status update validation failed', {
          requestId: req.id,
          error: error.message,
        });

        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid status update data',
            details: {
              validationErrors: error.details.map((d) => ({
                field: d.path.join('.'),
                message: d.message,
              })),
            },
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: req.id,
          },
        };
        res.status(400).json(response);
        return;
      }

      // Check if task exists
      const existingTask = await this.taskService.getTaskById(taskId, req.id);
      if (!existingTask) {
        logger.warn('Task not found for status update', {
          requestId: req.id,
          taskId,
        });

        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: `Task ${taskId} not found`,
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: req.id,
          },
        };
        res.status(404).json(response);
        return;
      }

      // Update status
      const changedByUserId = 1; // TODO: Extract from JWT token
      const updatedTask = await this.taskService.updateTaskStatus(
        taskId,
        value.status,
        value.comment,
        changedByUserId,
        req.id
      );

      const response: ApiResponse<typeof updatedTask> = {
        success: true,
        data: updatedTask,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.id,
        },
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/tasks/:id/assign
   * Assign or reassign a task to a user
   */
  async assignTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskId = parseInt(req.params.id, 10);

      logger.info('PATCH /tasks/:id/assign - Assign task request', {
        requestId: req.id,
        taskId,
        body: req.body,
      });

      if (Number.isNaN(taskId) || taskId <= 0) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: { code: 'INVALID_TASK_ID', message: 'Task ID must be a positive integer' },
          meta: { timestamp: new Date().toISOString(), requestId: req.id },
        };
        res.status(400).json(response);
        return;
      }

      const { error, value } = taskValidationSchemas.assign.validate(req.body);
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid assign data',
            details: {
              validationErrors: error.details.map((d) => ({
                field: d.path.join('.'),
                message: d.message,
              })),
            },
          },
          meta: { timestamp: new Date().toISOString(), requestId: req.id },
        };
        res.status(400).json(response);
        return;
      }

      const changedByUserId = 1; // TODO: Extract from JWT token
      const updatedTask = await this.taskService.assignTask(
        taskId,
        value.assignedUserId,
        changedByUserId,
        req.id
      );

      const response: ApiResponse<typeof updatedTask> = {
        success: true,
        data: updatedTask,
        error: null,
        meta: { timestamp: new Date().toISOString(), requestId: req.id },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/tasks/:id/dependencies
   * Add a dependency link to a task
   */
  async addDependency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskId = parseInt(req.params.id, 10);

      logger.info('POST /tasks/:id/dependencies - Add dependency request', {
        requestId: req.id,
        taskId,
        body: req.body,
      });

      if (Number.isNaN(taskId) || taskId <= 0) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: { code: 'INVALID_TASK_ID', message: 'Task ID must be a positive integer' },
          meta: { timestamp: new Date().toISOString(), requestId: req.id },
        };
        res.status(400).json(response);
        return;
      }

      const { error, value } = taskValidationSchemas.addDependency.validate(req.body);
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid dependency data',
            details: {
              validationErrors: error.details.map((d) => ({
                field: d.path.join('.'),
                message: d.message,
              })),
            },
          },
          meta: { timestamp: new Date().toISOString(), requestId: req.id },
        };
        res.status(400).json(response);
        return;
      }

      const createdByUserId = 1; // TODO: Extract from JWT token
      const dependency = await this.taskService.addTaskDependency(
        taskId,
        value.dependsOnTaskId,
        createdByUserId,
        req.id
      );

      const response: ApiResponse<typeof dependency> = {
        success: true,
        data: dependency,
        error: null,
        meta: { timestamp: new Date().toISOString(), requestId: req.id },
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/v1/tasks/:id/dependencies/:dependencyId
   * Remove a dependency link from a task
   */
  async removeDependency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskId = parseInt(req.params.id, 10);
      const dependencyId = parseInt(req.params.dependencyId, 10);

      logger.info('DELETE /tasks/:id/dependencies/:dependencyId - Remove dependency request', {
        requestId: req.id,
        taskId,
        dependencyId,
      });

      if (Number.isNaN(taskId) || taskId <= 0 || Number.isNaN(dependencyId) || dependencyId <= 0) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: { code: 'INVALID_PARAMS', message: 'Task ID and Dependency ID must be positive integers' },
          meta: { timestamp: new Date().toISOString(), requestId: req.id },
        };
        res.status(400).json(response);
        return;
      }

      const changedByUserId = 1; // TODO: Extract from JWT token
      await this.taskService.removeTaskDependency(taskId, dependencyId, changedByUserId, req.id);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
