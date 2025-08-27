import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, register, logout } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').optional().isString().isLength({ max: 100 }),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

router.post('/logout', logout);

router.get('/me', requireAuth, me);

export default router;
