import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

/**
 * Middleware to generate and attach a request ID to each request
 * Used for request tracing and logging
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Check for existing request ID in headers
  const existingId = req.headers['x-request-id'] as string;
  req.id = existingId || uuidv4();
  
  // Add request ID to response headers
  res.setHeader('x-request-id', req.id);
  
  next();
}
