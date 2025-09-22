import { Router } from 'express';
import { body } from 'express-validator';
import {
  login,
  register,
  logout,
  refresh,
  profile,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { requireAuth } from '../middleware/requireAuth';
import { authRateLimiter } from '../middleware/authRateLimiter';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password')
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage('Password must be at least 8 chars, include upper, lower, number'),
    body('name').optional().isString().trim().escape().isLength({ max: 100 }),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  authRateLimiter,
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

router.post('/refresh', authRateLimiter, refresh);

router.get('/verify-email', verifyEmail);

router.post(
  '/resend-verification',
  authRateLimiter,
  [body('email').isEmail().withMessage('Valid email required').normalizeEmail()],
  validateRequest,
  resendVerificationEmail
);

router.post(
  '/forgot-password',
  authRateLimiter,
  [body('email').isEmail().withMessage('Valid email required').normalizeEmail()],
  validateRequest,
  forgotPassword
);

router.post(
  '/reset-password',
  authRateLimiter,
  [
    body('password')
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage('Password must be at least 8 chars, include upper, lower, number'),
  ],
  validateRequest,
  resetPassword
);

router.post('/logout', requireAuth, logout);

router.get('/profile', requireAuth, profile);
// Back-compat alias
router.get('/me', requireAuth, profile);

export default router;
