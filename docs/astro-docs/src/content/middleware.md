# Middleware

Custom and third-party middleware used in the StackInsight Auth Lite backend.

## Core Middleware

- **helmet**: Security headers
- **cors**: CORS policy
- **cookie-parser**: Read HTTP-only cookies
- **express.json()**: Parse JSON payloads
- **pino-http** (optional): Request logging

```ts
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
```

## Rate Limiting

Global and per-endpoint limits with `express-rate-limit`.

```ts
app.use('/api/', apiLimiter);               // global
app.use('/api/auth/login', authLimiter);    // auth
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
```

## Authentication Middleware

Populate `req.user` from access token cookie.

```ts
export function authRequired(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['accessToken'];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

## Role Middleware

Restrict endpoints to specific roles.

```ts
export function requireRole(...roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
```

## Error Handler

Centralized error formatting.

```ts
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err?.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  const status = err?.status || 500;
  const message = err?.message || 'An unexpected error occurred';
  return res.status(status).json({ error: message });
}
```

## 404 Handler

```ts
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));
```

## Ordering Notes

1. `trust proxy`
2. Security (helmet), body parsers, cookies
3. CORS
4. Rate limiting
5. Routes
6. Error handlers (last)
