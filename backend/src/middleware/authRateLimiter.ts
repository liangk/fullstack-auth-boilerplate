import rateLimit from 'express-rate-limit';

const windowMinutes = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES || '1', 10);
const maxRequests = parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5', 10);

export const authRateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts, please try again later.' },
});
