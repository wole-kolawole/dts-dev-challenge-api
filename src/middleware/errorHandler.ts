import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(err);

  res.status(statusCode).json({
    error: message,
    details: err.details || undefined,
  });
}
