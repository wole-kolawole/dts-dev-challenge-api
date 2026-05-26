import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((validationError) => ({
      field: (validationError as any).param,
      message: validationError.msg,
    }));
    return res.status(400).json({
      error: 'Validation failed',
      details,
    });
  }

  next();
}
