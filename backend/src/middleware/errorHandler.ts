import type { Request, Response, NextFunction } from 'express';

/**
 * Global error handler — ensures consistent JSON shape.
 */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[error]', err);
  const status = err.statusCode ?? err.status ?? 500;
  const message = err.message ?? 'Internal server error';
  res.status(status).json({ success: false, message, ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }) });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: 'Route not found' });
}
