# Error Handling

Complete guide to API error responses and codes in StackInsight Auth Lite.

## Error Response Format

All API errors follow a consistent JSON format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": [...],  // Optional: validation errors or additional info
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## HTTP Status Codes

### 2xx Success

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request succeeded, no content to return |

### 4xx Client Errors

| Code | Name | Common Causes |
|------|------|---------------|
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Semantic errors in request |
| 429 | Too Many Requests | Rate limit exceeded |

### 5xx Server Errors

| Code | Name | Description |
|------|------|-------------|
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | Upstream service error |
| 503 | Service Unavailable | Service temporarily down |
| 504 | Gateway Timeout | Request timeout |

---

## Common Error Responses

### 400 Bad Request

**Validation Errors:**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "invalid_email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters",
      "code": "password_too_short"
    }
  ],
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Malformed Request:**
```json
{
  "error": "Invalid JSON in request body",
  "code": "INVALID_JSON",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 401 Unauthorized

**Missing Authentication:**
```json
{
  "error": "Authentication required",
  "code": "AUTH_REQUIRED",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Invalid Credentials:**
```json
{
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Token Expired:**
```json
{
  "error": "Access token has expired",
  "code": "TOKEN_EXPIRED",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Invalid Token:**
```json
{
  "error": "Invalid or malformed token",
  "code": "INVALID_TOKEN",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 403 Forbidden

**Insufficient Permissions:**
```json
{
  "error": "You do not have permission to access this resource",
  "code": "INSUFFICIENT_PERMISSIONS",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Email Not Verified:**
```json
{
  "error": "Please verify your email before logging in",
  "code": "EMAIL_NOT_VERIFIED",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Account Suspended:**
```json
{
  "error": "Your account has been suspended",
  "code": "ACCOUNT_SUSPENDED",
  "details": {
    "reason": "Terms of service violation",
    "suspendedAt": "2024-01-20T10:30:00.000Z"
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 404 Not Found

**Resource Not Found:**
```json
{
  "error": "User not found",
  "code": "USER_NOT_FOUND",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Endpoint Not Found:**
```json
{
  "error": "Endpoint not found",
  "code": "ENDPOINT_NOT_FOUND",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 409 Conflict

**Resource Already Exists:**
```json
{
  "error": "User with this email already exists",
  "code": "USER_EXISTS",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**State Conflict:**
```json
{
  "error": "Email is already verified",
  "code": "EMAIL_ALREADY_VERIFIED",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 429 Too Many Requests

**Rate Limit Exceeded:**
```json
{
  "error": "Too many requests, please try again later",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900,  // seconds until retry allowed
  "limit": 5,
  "window": "15 minutes",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 500 Internal Server Error

**Generic Server Error:**
```json
{
  "error": "An unexpected error occurred",
  "code": "INTERNAL_SERVER_ERROR",
  "requestId": "req_abc123def",  // For support reference
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Database Error:**
```json
{
  "error": "Database operation failed",
  "code": "DATABASE_ERROR",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

---

## Error Codes Reference

### Authentication Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_REQUIRED | 401 | Authentication is required |
| INVALID_CREDENTIALS | 401 | Wrong email or password |
| TOKEN_EXPIRED | 401 | Access token has expired |
| INVALID_TOKEN | 401 | Token is invalid or malformed |
| REFRESH_TOKEN_EXPIRED | 401 | Refresh token has expired |
| REFRESH_TOKEN_INVALID | 401 | Refresh token is invalid |
| EMAIL_NOT_VERIFIED | 403 | Email verification required |
| ACCOUNT_SUSPENDED | 403 | Account has been suspended |
| ACCOUNT_DELETED | 403 | Account has been deleted |

### Validation Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| INVALID_EMAIL | 400 | Email format is invalid |
| INVALID_PASSWORD | 400 | Password doesn't meet requirements |
| PASSWORD_TOO_SHORT | 400 | Password is too short |
| PASSWORD_TOO_WEAK | 400 | Password is too weak |
| PASSWORDS_DONT_MATCH | 400 | Passwords don't match |
| INVALID_NAME | 400 | Name format is invalid |
| INVALID_JSON | 400 | JSON parsing error |

### Resource Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| USER_NOT_FOUND | 404 | User doesn't exist |
| TOKEN_NOT_FOUND | 404 | Token not found or expired |
| ENDPOINT_NOT_FOUND | 404 | API endpoint doesn't exist |
| USER_EXISTS | 409 | Email already registered |
| EMAIL_ALREADY_VERIFIED | 409 | Email is already verified |

### Rate Limiting Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| LOGIN_ATTEMPTS_EXCEEDED | 429 | Too many login attempts |
| REGISTRATION_RATE_LIMIT | 429 | Too many registrations from IP |

### Server Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INTERNAL_SERVER_ERROR | 500 | Unexpected server error |
| DATABASE_ERROR | 500 | Database operation failed |
| EMAIL_SEND_FAILED | 500 | Failed to send email |
| TOKEN_GENERATION_FAILED | 500 | Failed to generate token |

---

## Frontend Error Handling

### Angular HTTP Interceptor

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorMessage = error.error?.error || error.message;

          // Handle specific error codes
          switch (error.error?.code) {
            case 'TOKEN_EXPIRED':
            case 'AUTH_REQUIRED':
              this.router.navigate(['/login']);
              break;
            case 'EMAIL_NOT_VERIFIED':
              this.router.navigate(['/verify-email']);
              break;
            case 'RATE_LIMIT_EXCEEDED':
              // Show rate limit message
              break;
          }
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
```

### Error Service

```typescript
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any) {
    const message = this.getErrorMessage(error);
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.error) {
      return error.error.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}
```

### Component Error Handling

```typescript
export class LoginComponent {
  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error) => {
        // Handle specific errors
        if (error.error?.code === 'INVALID_CREDENTIALS') {
          this.errorMessage = 'Invalid email or password';
        } else if (error.error?.code === 'EMAIL_NOT_VERIFIED') {
          this.errorMessage = 'Please verify your email first';
          this.showResendButton = true;
        } else if (error.error?.code === 'RATE_LIMIT_EXCEEDED') {
          const retryAfter = error.error.retryAfter || 900;
          this.errorMessage = `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes`;
        } else {
          this.errorMessage = error.error?.error || 'Login failed';
        }
      }
    });
  }
}
```

---

## Best Practices

### For API Consumers

1. **Always Handle Errors**: Wrap API calls in try-catch or use error callbacks
2. **Check Status Codes**: Don't assume all 2xx responses are identical
3. **Parse Error Messages**: Display user-friendly messages from API
4. **Log Errors**: Send client errors to monitoring service
5. **Retry Logic**: Implement exponential backoff for 5xx errors
6. **Handle Rate Limits**: Respect `retryAfter` values

### For API Developers

1. **Consistent Format**: All errors follow same JSON structure
2. **Descriptive Messages**: Error messages should be clear and actionable
3. **Error Codes**: Use machine-readable codes for programmatic handling
4. **Security**: Don't leak sensitive information in error messages
5. **Logging**: Log all errors with context for debugging
6. **Documentation**: Document all possible errors for each endpoint

---

## Debugging Tips

### Check Request Logs

```bash
# Backend logs
docker-compose logs backend | grep ERROR

# Specific error code
docker-compose logs backend | grep "INVALID_CREDENTIALS"
```

### Test Error Scenarios

```bash
# Invalid credentials
curl -X POST http://localhost:4005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@example.com","password":"wrong"}'

# Rate limit
for i in {1..10}; do
  curl -X POST http://localhost:4005/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

### Monitor Error Rates

Use monitoring tools to track:
- 4xx error rates by endpoint
- 5xx error rates
- Most common error codes
- Response time for error requests

---

## See Also

- [API Reference](./api-reference.md) - Complete API documentation
- [Authentication API](./api-auth.md) - Auth endpoint details
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
