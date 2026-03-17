import { createApp } from '../../app';
import request from 'supertest';

describe('Task Management API - Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /api/v1/tasks - Create Task', () => {
    it('should create a new task with all required fields', async () => {
      const taskData = {
        title: 'Implement Payment API',
        description: 'Create RESTful API for payment processing',
        priority: 'High',
        status: 'ToDo',
        assignedUserId: 1,
        estimatedCompletionDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('taskIdCode');
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.priority).toBe(taskData.priority);
      expect(response.body.meta).toHaveProperty('requestId');
    });

    it('should reject task without required title', async () => {
      const taskData = {
        description: 'Missing title',
        priority: 'High',
        status: 'ToDo',
        assignedUserId: 1,
        estimatedCompletionDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject task with past estimated completion date', async () => {
      const taskData = {
        title: 'Old task',
        priority: 'High',
        status: 'ToDo',
        assignedUserId: 1,
        estimatedCompletionDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject task with invalid priority', async () => {
      const taskData = {
        title: 'Test task',
        priority: 'Urgent',
        status: 'ToDo',
        assignedUserId: 1,
        estimatedCompletionDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/tasks - List Tasks', () => {
    it('should list all tasks', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('pagination');
      expect(response.body.meta.pagination.page).toBe(1);
      expect(response.body.meta.pagination.pageSize).toBe(20);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?status=ToDo')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      response.body.data.forEach((task: any) => {
        expect(task.status).toBe('ToDo');
      });
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?priority=High')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((task: any) => {
        expect(task.priority).toBe('High');
      });
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?pageNumber=1&pageSize=5')
        .expect(200);

      expect(response.body.meta.pagination.pageSize).toBe(5);
      expect(response.body.meta.pagination.page).toBe(1);
    });

    it('should reject invalid status filter', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?status=InvalidStatus')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_FILTER');
    });
  });

  describe('GET /api/v1/tasks/:id - Get Task', () => {
    let taskId: number;

    beforeEach(async () => {
      // Create a task first
      const taskData = {
        title: 'Test task for retrieval',
        priority: 'Medium',
        status: 'ToDo',
        assignedUserId: 1,
        estimatedCompletionDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const createResponse = await request(app)
        .post('/api/v1/tasks')
        .send(taskData);

      taskId = createResponse.body.data.id;
    });

    it('should get task by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
      expect(response.body.data).toHaveProperty('taskIdCode');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('should reject invalid task ID', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_TASK_ID');
    });
  });

  describe('PATCH /api/v1/tasks/:id/status - Update Task Status', () => {
    let taskId: number;

    beforeEach(async () => {
      // Create a task first
      const taskData = {
        title: 'Test task for status update',
        priority: 'Low',
        status: 'ToDo',
        assignedUserId: 1,
        estimatedCompletionDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const createResponse = await request(app)
        .post('/api/v1/tasks')
        .send(taskData);

      taskId = createResponse.body.data.id;
    });

    it('should update task status', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .send({
          status: 'InProgress',
          comment: 'Started working on this',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('InProgress');
    });

    it('should reject invalid status', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .send({
          status: 'InvalidStatus',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/api/v1/tasks/99999/status')
        .send({
          status: 'Completed',
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('should record status change in history', async () => {
      // Update status
      const updateResponse = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .send({
          status: 'Completed',
          comment: 'Task completed',
        })
        .expect(200);

      expect(updateResponse.body.data.status).toBe('Completed');
      expect(updateResponse.body.meta).toHaveProperty('requestId');
    });
  });
});
