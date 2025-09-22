import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    message: 'Validation failed',
    errors: errors.array().map((e) => {
      if (e.type === 'field') {
        return { field: e.path, message: e.msg };
      }
      return { field: 'unknown', message: e.msg };
    }),
  });
}
