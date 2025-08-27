import rateLimit from 'express-rate-limit';

const windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);

export const apiLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
