# API Rate Limiting

Configure and operate rate limiting in StackInsight Auth Lite.

## Goals

- Protect authentication endpoints from brute force
- Prevent abuse of public endpoints
- Ensure fair use of system resources

## Backend Configuration

Using `express-rate-limit`:

```ts
import rateLimit from 'express-rate-limit';

// Global API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requests/window per IP
  standardHeaders: true,
  legacyHeaders: false
});

// Auth-specific limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true
});

// Apply
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
```

## Response When Limited

```json
{
  "error": "Too many requests, please try again later",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

## Production Considerations

- **Proxies/CDN**: Configure `app.set('trust proxy', 1)` when behind proxy (Railway/Render/Heroku)
- **IP Strategy**: Consider user id + IP for authenticated endpoints
- **Whitelist**: Allow health checks and internal services
- **Burst Control**: Use shorter windows for bursty endpoints (e.g., 1s/5 requests)

## Monitoring

- Log limited events (IP, route, count)
- Dashboard tile for rate-limit occurrences
- Alert on spikes (possible attack)

## Advanced Options

- Redis-based distributed limits (multiple instances)
- Sliding window algorithm for smoother limits
- Per-user limits on sensitive actions

## Frontend UX

- Show friendly message and retry-after
- Disable submit on repeated failures
- Add micro-delays between retries

## See Also

- [Error Handling](./error-handling.md)
- [Security Best Practices](./security.md)
