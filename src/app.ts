import express, { Express, Request, Response, NextFunction } from 'express';
import { config } from './config/environment';
import { requestIdMiddleware } from './middleware/request-id';
import { healthRouter } from './routes/health';
import { tasksRouter } from './routes/tasks';
import { logger } from './utils/logger';
import { ApiResponse } from './models/types';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);

  // Logging middleware
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`, {
      requestId: req.id,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // Health check routes (mounted at /api/v1/health)
  app.use(`${config.api.baseUrl}/health`, healthRouter);

  // Task management routes (mounted at /api/v1/tasks)
  app.use(`${config.api.baseUrl}/tasks`, tasksRouter);

  // 404 handler
  app.use((req: Request, res: Response) => {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.id,
      },
    };
    res.status(404).json(response);
  });

  // Error handling middleware (must be last)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled error', {
      requestId: req.id,
      error: err.message,
      stack: err.stack,
    });

    const statusCode = (err as any).statusCode || 500;
    const errorCode = (err as any).code || 'INTERNAL_SERVER_ERROR';

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code: errorCode,
        message: config.isDevelopment
          ? err.message
          : 'An unexpected error occurred',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.id,
      },
    };

    res.status(statusCode).json(response);
  });

  return app;
}
