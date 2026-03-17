import path from 'path';
import fs from 'fs/promises';
import { Task, TaskDependency, StatusHistory } from '../models/types';
import { logger } from '../utils/logger';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

/**
 * Interface for Task Repository
 * Abstracts data access logic for tasks, dependencies, and status history
 */
export interface ITaskRepository {
  createTask(task: Task): Promise<Task>;
  getTaskById(taskId: number): Promise<Task | null>;
  getAllTasks(): Promise<Task[]>;
  updateTask(taskId: number, updates: Partial<Task>): Promise<Task | null>;
  deleteTask(taskId: number): Promise<boolean>;
  addDependency(dependency: TaskDependency): Promise<TaskDependency>;
  getDependencies(taskId: number): Promise<TaskDependency[]>;
  getDependencyById(dependencyId: number): Promise<TaskDependency | null>;
  removeDependency(dependencyId: number): Promise<boolean>;
  getTasksDependingOn(taskId: number): Promise<TaskDependency[]>;
  recordStatusHistory(entry: StatusHistory): Promise<StatusHistory>;
  getStatusHistory(taskId: number): Promise<StatusHistory[]>;
}

/**
 * Task Repository Implementation
 * Uses in-memory JSON files for development (no database required)
 */
export class TaskRepository implements ITaskRepository {
  private tasksFile = path.join(DATA_DIR, 'tasks.json');
  private dependenciesFile = path.join(DATA_DIR, 'task-dependencies.json');
  private statusHistoryFile = path.join(DATA_DIR, 'status-history.json');

  constructor() {
    this.init();
  }

  /**
   * Initialize data files if they don't exist
   */
  private async init(): Promise<void> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Initialize tasks file
      try {
        await fs.access(this.tasksFile);
      } catch {
        await fs.writeFile(this.tasksFile, JSON.stringify([], null, 2));
      }

      // Initialize dependencies file
      try {
        await fs.access(this.dependenciesFile);
      } catch {
        await fs.writeFile(this.dependenciesFile, JSON.stringify([], null, 2));
      }

      // Initialize status history file
      try {
        await fs.access(this.statusHistoryFile);
      } catch {
        await fs.writeFile(this.statusHistoryFile, JSON.stringify([], null, 2));
      }
    } catch (error) {
      logger.error('Failed to initialize repository files', { error });
    }
  }

  /**
   * Read all tasks from persistent storage
   */
  private async readTasks(): Promise<Task[]> {
    try {
      const content = await fs.readFile(this.tasksFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      logger.error('Failed to read tasks file', { error });
      return [];
    }
  }

  /**
   * Write all tasks to persistent storage
   */
  private async writeTasks(tasks: Task[]): Promise<void> {
    try {
      await fs.writeFile(this.tasksFile, JSON.stringify(tasks, null, 2));
    } catch (error) {
      logger.error('Failed to write tasks file', { error });
      throw error;
    }
  }

  /**
   * Read all dependencies from persistent storage
   */
  private async readDependencies(): Promise<TaskDependency[]> {
    try {
      const content = await fs.readFile(this.dependenciesFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      logger.error('Failed to read dependencies file', { error });
      return [];
    }
  }

  /**
   * Write all dependencies to persistent storage
   */
  private async writeDependencies(deps: TaskDependency[]): Promise<void> {
    try {
      await fs.writeFile(this.dependenciesFile, JSON.stringify(deps, null, 2));
    } catch (error) {
      logger.error('Failed to write dependencies file', { error });
      throw error;
    }
  }

  /**
   * Read all status history entries from persistent storage
   */
  private async readStatusHistory(): Promise<StatusHistory[]> {
    try {
      const content = await fs.readFile(this.statusHistoryFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      logger.error('Failed to read status history file', { error });
      return [];
    }
  }

  /**
   * Write all status history entries to persistent storage
   */
  private async writeStatusHistory(history: StatusHistory[]): Promise<void> {
    try {
      await fs.writeFile(this.statusHistoryFile, JSON.stringify(history, null, 2));
    } catch (error) {
      logger.error('Failed to write status history file', { error });
      throw error;
    }
  }

  /**
   * Generate next task ID
   */
  private async getNextTaskId(): Promise<number> {
    const tasks = await this.readTasks();
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map((t) => t.id)) + 1;
  }

  /**
   * Generate task ID code (e.g., T-1001)
   */
  private async generateTaskIdCode(): Promise<string> {
    const nextId = await this.getNextTaskId();
    return `T-${1000 + nextId}`;
  }

  /**
   * Create a new task
   */
  async createTask(task: Partial<Task>): Promise<Task> {
    const tasks = await this.readTasks();
    const newTask: Task = {
      id: await this.getNextTaskId(),
      taskIdCode: await this.generateTaskIdCode(),
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'Low',
      status: task.status || 'ToDo',
      assignedUserId: task.assignedUserId || 0,
      estimatedCompletionDate: task.estimatedCompletionDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdByUserId: task.createdByUserId || 0,
      version: 1,
    };

    tasks.push(newTask);
    await this.writeTasks(tasks);
    return newTask;
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId: number): Promise<Task | null> {
    const tasks = await this.readTasks();
    return tasks.find((t) => t.id === taskId) || null;
  }

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    return this.readTasks();
  }

  /**
   * Update task
   */
  async updateTask(taskId: number, updates: Partial<Task>): Promise<Task | null> {
    const tasks = await this.readTasks();
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      id: tasks[index].id, // Prevent ID modification
      taskIdCode: tasks[index].taskIdCode, // Prevent code modification
      createdAt: tasks[index].createdAt, // Prevent creation date modification
      createdByUserId: tasks[index].createdByUserId, // Prevent creator modification
      updatedAt: new Date(),
      version: (tasks[index].version || 1) + 1,
    };

    await this.writeTasks(tasks);
    return tasks[index];
  }

  /**
   * Delete task
   */
  async deleteTask(taskId: number): Promise<boolean> {
    const tasks = await this.readTasks();
    const filtered = tasks.filter((t) => t.id !== taskId);

    if (filtered.length === tasks.length) return false; // Task not found

    await this.writeTasks(filtered);
    return true;
  }

  /**
   * Add task dependency
   */
  async addDependency(dependency: Partial<TaskDependency>): Promise<TaskDependency> {
    const deps = await this.readDependencies();
    const newDep: TaskDependency = {
      id: deps.length > 0 ? Math.max(...deps.map((d) => d.id)) + 1 : 1,
      taskId: dependency.taskId || 0,
      dependsOnTaskId: dependency.dependsOnTaskId || 0,
      createdAt: new Date(),
      createdByUserId: dependency.createdByUserId || 0,
    };

    deps.push(newDep);
    await this.writeDependencies(deps);
    return newDep;
  }

  /**
   * Get dependencies for a task
   */
  async getDependencies(taskId: number): Promise<TaskDependency[]> {
    const deps = await this.readDependencies();
    return deps.filter((d) => d.taskId === taskId);
  }

  /**
   * Get a single dependency by its ID
   */
  async getDependencyById(dependencyId: number): Promise<TaskDependency | null> {
    const deps = await this.readDependencies();
    return deps.find((d) => d.id === dependencyId) || null;
  }

  /**
   * Remove a dependency by its ID
   */
  async removeDependency(dependencyId: number): Promise<boolean> {
    const deps = await this.readDependencies();
    const filtered = deps.filter((d) => d.id !== dependencyId);
    if (filtered.length === deps.length) return false;
    await this.writeDependencies(filtered);
    return true;
  }

  /**
   * Get all dependencies where dependsOnTaskId matches (reverse lookup)
   */
  async getTasksDependingOn(taskId: number): Promise<TaskDependency[]> {
    const deps = await this.readDependencies();
    return deps.filter((d) => d.dependsOnTaskId === taskId);
  }

  /**
   * Record status history entry
   */
  async recordStatusHistory(entry: Partial<StatusHistory>): Promise<StatusHistory> {
    const history = await this.readStatusHistory();
    const newEntry: StatusHistory = {
      id: history.length > 0 ? Math.max(...history.map((h) => h.id)) + 1 : 1,
      taskId: entry.taskId || 0,
      oldStatus: entry.oldStatus,
      newStatus: entry.newStatus || 'ToDo',
      changedAt: new Date(),
      changedByUserId: entry.changedByUserId || 0,
      comment: entry.comment,
    };

    history.push(newEntry);
    await this.writeStatusHistory(history);
    return newEntry;
  }

  /**
   * Get status history for a task
   */
  async getStatusHistory(taskId: number): Promise<StatusHistory[]> {
    const history = await this.readStatusHistory();
    return history.filter((h) => h.taskId === taskId);
  }
}
