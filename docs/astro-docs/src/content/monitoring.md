# Monitoring & Logging

Set up monitoring, logging, and observability for StackInsight Auth Lite deployments.

## What to Monitor

- **Availability**: Uptime, response time, error rate
- **Auth Health**: Login failures, token refresh failures, email bounces
- **DB Health**: Connections, slow queries, errors
- **Security Signals**: Suspicious logins, rate-limit spikes, password reset volume

## Application Logging

### Backend (Express)

```ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

// Usage
logger.info({ userId, email }, 'User logged in');
logger.warn({ ip }, 'Failed login attempt');
logger.error({ err }, 'Unhandled error');
```

Add a request logger:
```ts
import pinoHttp from 'pino-http';
app.use(pinoHttp({ logger }));
```

### Frontend (Angular)

Use a lightweight logging service:
```ts
@Injectable({ providedIn: 'root' })
export class LogService {
  info(message: string, data?: any) { console.info(message, data); }
  warn(message: string, data?: any) { console.warn(message, data); }
  error(message: string, data?: any) { console.error(message, data); }
}
```

Hook into global error handler:
```ts
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any) {
    // send to monitoring service
    console.error('Global Error:', error);
  }
}
```

## Metrics & Dashboards

- **Key Metrics**
  - API latency (p95/p99)
  - Error rate by endpoint
  - Login success vs failure
  - Registrations per day
  - Email send success vs bounce

- **Tools**
  - Hosted: Datadog, New Relic, Sentry, Logtail
  - OSS: Prometheus + Grafana, Loki for logs

### Example Prometheus Style Counters (pseudo)
```ts
auth_login_total{status="success"}
auth_login_total{status="failed"}
auth_register_total
email_send_total{type="verification"}
```

## Alerts

- High 5xx error rate (>2% for 5 min)
- Login failures spike (>N/min)
- Token refresh failures spike
- DB connection errors
- Email bounce rate spike

## Tracing (Optional)

Use OpenTelemetry for distributed tracing across services.
```ts
// Pseudo setup
import { NodeSDK } from '@opentelemetry/sdk-node';
const sdk = new NodeSDK({ /* exporters & instrumentations */ });
sdk.start();
```

## Audit Logs

Log security-sensitive actions with user id, ip, and timestamp:
- Login/logout
- Password change/reset
- Email change/verification
- Role changes

## Log Retention

- Keep application logs for 14–30 days
- Keep audit logs for 6–12 months

## Railway Notes

- Enable log drain to your provider
- Set alerting on Railway metrics (CPU, memory, restarts)

## Best Practices

- **Structure** logs as JSON in production
- **Redact** PII and secrets from logs
- **Sample** high-volume logs
- **Correlate** logs with request IDs

## See Also

- [Error Handling](./error-handling.md)
- [Security Best Practices](./security.md)
