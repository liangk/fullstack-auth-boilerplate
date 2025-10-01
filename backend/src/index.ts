import 'dotenv/config';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/authRoutes';
import healthRoutes from './routes/health';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS setup
const origins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true); // allow non-browser clients
    if (origins.length === 0 || origins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// Trust proxy for secure cookies behind proxies (e.g., Heroku, Render)
app.set('trust proxy', 1);

// Security and parsers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));
app.use(cors(corsOptions));
app.use(logger);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Rate limiter for all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
// Also expose non-API prefixed auth routes to match requested paths
app.use('/auth', authRoutes);

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[${NODE_ENV}] server listening on http://localhost:${PORT}`);
});
