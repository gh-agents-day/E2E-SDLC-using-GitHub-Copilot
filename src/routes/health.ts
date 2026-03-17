import { Router, Request, Response } from 'express';
import { config } from '../config/environment';
import { HealthCheckResponse, ApiResponse } from '../models/types';

export const healthRouter = Router();

/**
 * GET /api/v1/health
 * Health check endpoint to verify API is running
 * Returns: { status: "ok", timestamp: <ISO>, version: "1.0.0" }
 */
healthRouter.get('/', (req: Request, res: Response) => {
  const response: ApiResponse<HealthCheckResponse> = {
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: config.api.version,
      uptime: process.uptime(),
    },
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.id,
    },
  };

  res.status(200).json(response);
});
