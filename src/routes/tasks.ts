import { Router, Request, Response, NextFunction } from 'express';
import { TaskController } from '../controllers/task-controller';

export const tasksRouter = Router();
const taskController = new TaskController();

/**
 * POST /api/v1/tasks
 * Create a new task
 * 
 * Request Body:
 * {
 *   "title": "Task title",
 *   "description": "Optional description",
 *   "priority": "High|Medium|Low",
 *   "status": "ToDo|InProgress|Blocked|Completed",
 *   "assignedUserId": 5,
 *   "estimatedCompletionDate": "2026-04-15"
 * }
 * 
 * Response: 201 Created with task data
 */
tasksRouter.post(
  '/',
  (req: Request, res: Response, next: NextFunction) =>
    taskController.createTask(req, res, next)
);

/**
 * GET /api/v1/tasks
 * List all tasks with optional filtering and pagination
 * 
 * Query Parameters:
 * - status: Filter by status (ToDo|InProgress|Blocked|Completed)
 * - priority: Filter by priority (Low|Medium|High)
 * - assignedUserId: Filter by assigned user ID
 * - dueDateFrom: Filter tasks due on or after this date
 * - dueDateTo: Filter tasks due on or before this date
 * - pageNumber: Page number (1-based, default 1)
 * - pageSize: Items per page (default 20, max 100)
 * - sortBy: Sort field (default: createdAt)
 * - sortOrder: Sort direction (asc|desc, default: desc)
 * 
 * Response: 200 OK with tasks array and pagination metadata
 */
tasksRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) =>
    taskController.getTasksList(req, res, next)
);

/**
 * GET /api/v1/tasks/:id
 * Get a specific task by ID
 * 
 * Parameters:
 * - id: Task ID
 * 
 * Response: 200 OK with task data, or 404 if not found
 */
tasksRouter.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) =>
    taskController.getTaskById(req, res, next)
);

/**
 * PATCH /api/v1/tasks/:id/status
 * Update task status with business rule validation
 * 
 * Automatically enforces:
 * - Blocks task if it has pending dependencies
 * - Creates status history entry
 * - Validates status transition
 * 
 * Request Body:
 * {
 *   "status": "ToDo|InProgress|Blocked|Completed",
 *   "comment": "Optional status change comment"
 * }
 * 
 * Parameters:
 * - id: Task ID
 * 
 * Response: 200 OK with updated task data, or 404 if not found
 */
tasksRouter.patch(
  '/:id/status',
  (req: Request, res: Response, next: NextFunction) =>
    taskController.updateTaskStatus(req, res, next)
);

/**
 * PATCH /api/v1/tasks/:id/assign
 * Assign or reassign a task to a user
 *
 * Request Body:
 * {
 *   "assignedUserId": 5
 * }
 *
 * Response: 200 OK with updated task data
 */
tasksRouter.patch(
  '/:id/assign',
  (req: Request, res: Response, next: NextFunction) =>
    taskController.assignTask(req, res, next)
);

/**
 * POST /api/v1/tasks/:id/dependencies
 * Add a dependency between tasks
 *
 * Request Body:
 * {
 *   "dependsOnTaskId": 3
 * }
 *
 * Response: 201 Created with dependency data
 */
tasksRouter.post(
  '/:id/dependencies',
  (req: Request, res: Response, next: NextFunction) =>
    taskController.addDependency(req, res, next)
);

/**
 * DELETE /api/v1/tasks/:id/dependencies/:dependencyId
 * Remove a dependency link from a task; re-evaluates blocked status
 *
 * Response: 204 No Content
 */
tasksRouter.delete(
  '/:id/dependencies/:dependencyId',
  (req: Request, res: Response, next: NextFunction) =>
    taskController.removeDependency(req, res, next)
);
