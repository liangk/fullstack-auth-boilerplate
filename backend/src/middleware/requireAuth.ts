import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { COOKIE_NAME } from '../utils/constants';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    return next();
  } catch (_e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
