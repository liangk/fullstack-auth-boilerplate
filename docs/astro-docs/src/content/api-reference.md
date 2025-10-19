# API Reference

Complete reference for all API endpoints in the Fullstack Auth Boilerplate.

## Base URL

- **Development**: `http://localhost:4005/api`
- **Production**: Your deployed backend URL + `/api`

## Authentication

All protected endpoints require authentication via HTTP-only cookies. Cookies are automatically sent by the browser.

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [ ... ]  // Optional validation errors
}
```

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"  // Optional
}
```

**Validation Rules**:
- Email: Must be valid email format
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Name: Optional, max 100 characters

**Success Response** (201):
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "userId": "uuid-string"
}
```

**Error Responses**:
- `400`: Validation failed
- `409`: Email already registered
- `500`: Server error

---

### Login

Authenticate and receive access/refresh tokens.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response** (200):
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Cookies Set**:
- `access_token`: JWT access token (15 min expiry)
- `refresh_token`: JWT refresh token (7 day expiry)

**Error Responses**:
- `401`: Invalid credentials
- `403`: Email not verified
- `500`: Server error

---

### Logout

Invalidate current session and clear tokens.

**Endpoint**: `POST /api/auth/logout`

**Authentication**: Required

**Success Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

---

### Refresh Token

Get a new access token using refresh token.

**Endpoint**: `POST /api/auth/refresh`

**Cookies Required**: `refresh_token`

**Success Response** (200):
- Sets new `access_token` cookie
- Returns empty response

**Error Responses**:
- `401`: Invalid or expired refresh token
- `500`: Server error

---

### Get Profile

Get current authenticated user's profile.

**Endpoint**: `GET /api/auth/profile`

**Authentication**: Required

**Success Response** (200):
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- `401`: Not authenticated
- `404`: User not found

---

### Update Profile

Update user profile information.

**Endpoint**: `PUT /api/auth/profile`

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "newemail@example.com"
}
```

**Success Response** (200):
```json
{
  "id": "user-uuid",
  "email": "newemail@example.com",
  "name": "Jane Doe",
  "emailVerified": false,  // Reset if email changed
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- `400`: Validation failed
- `401`: Not authenticated
- `409`: Email already in use

---

### Change Password

Change user password.

**Endpoint**: `PUT /api/auth/change-password`

**Authentication**: Required

**Request Body**:
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

**Validation Rules**:
- New password: Min 6 chars, 1 uppercase, 1 lowercase, 1 number

**Success Response** (200):
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses**:
- `400`: Validation failed
- `401`: Current password incorrect
- `500`: Server error

---

### Verify Email

Verify email address using token from email.

**Endpoint**: `GET /api/auth/verify-email?token=<token>`

**Query Parameters**:
- `token`: Email verification token (JWT)

**Success Response** (200):
```json
{
  "message": "Email verified successfully"
}
```

**Error Responses**:
- `400`: Invalid or expired token
- `404`: User not found
- `500`: Server error

---

### Resend Verification Email

Request a new verification email.

**Endpoint**: `POST /api/auth/resend-verification`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "message": "Verification email sent successfully"
}
```

**Error Responses**:
- `400`: Email already verified
- `404`: User not found
- `500`: Server error

---

### Forgot Password

Request password reset email.

**Endpoint**: `POST /api/auth/forgot-password`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "message": "Password reset email sent successfully"
}
```

**Note**: Always returns success even if email doesn't exist (security measure)

---

### Reset Password

Reset password using token from email.

**Endpoint**: `POST /api/auth/reset-password`

**Request Body**:
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123"
}
```

**Success Response** (200):
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses**:
- `400`: Invalid or expired token
- `400`: Validation failed
- `500`: Server error

---

## Dashboard Endpoints

All dashboard endpoints require authentication.

### Get Dashboard Statistics

Get overall dashboard statistics.

**Endpoint**: `GET /api/dashboard/stats`

**Authentication**: Required

**Success Response** (200):
```json
{
  "totalUsers": 150,
  "verifiedUsers": 120,
  "unverifiedUsers": 30,
  "newUsersToday": 5,
  "newUsersWeek": 25,
  "newUsersMonth": 80,
  "verificationRate": 80
}
```

---

### Get Recent Users

Get list of recently registered users.

**Endpoint**: `GET /api/dashboard/users/recent`

**Authentication**: Required

**Query Parameters**:
- `limit` (optional): Number of users to return (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Success Response** (200):
```json
{
  "users": [
    {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "emailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 150,
  "limit": 10,
  "offset": 0
}
```

---

### Get User Growth Data

Get user registration growth over time.

**Endpoint**: `GET /api/dashboard/users/growth`

**Authentication**: Required

**Query Parameters**:
- `days` (optional): Number of days to retrieve (default: 30)

**Success Response** (200):
```json
[
  {
    "date": "2024-01-01",
    "count": 5
  },
  {
    "date": "2024-01-02",
    "count": 8
  }
]
```

---

### Get User Activity

Get user activity metrics.

**Endpoint**: `GET /api/dashboard/users/activity`

**Authentication**: Required

**Success Response** (200):
```json
{
  "activeLastDay": 45,
  "activeLastWeek": 120
}
```

**Note**: "Active" means user record was updated (login, profile change, etc.)

---

## Health Check Endpoint

### Health Check

Check if the API is running.

**Endpoint**: `GET /api/health`

**Authentication**: Not required

**Success Response** (200):
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

### General API Endpoints
- **Window**: 15 minutes
- **Max Requests**: 100 per IP

### Authentication Endpoints
- **Window**: 1 minute
- **Max Requests**: 5 per IP

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

**Rate Limit Exceeded Response** (429):
```json
{
  "error": "Too many requests, please try again later"
}
```

---

## CORS

The API supports CORS with credentials. Allowed origins are configured via the `CORS_ORIGIN` environment variable.

**CORS Headers**:
```
Access-Control-Allow-Origin: <configured-origin>
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

## Error Codes Summary

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation failed) |
| 401 | Unauthorized (authentication required) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

---

## Example Requests

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:4005/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","name":"Test User"}'
```

**Login**:
```bash
curl -X POST http://localhost:4005/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

**Get Profile** (with cookies):
```bash
curl -X GET http://localhost:4005/api/auth/profile \
  -b cookies.txt
```

### Using JavaScript (Fetch)

```javascript
// Register
const response = await fetch('http://localhost:4005/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123456',
    name: 'Test User'
  })
});

// Login with credentials
const loginResponse = await fetch('http://localhost:4005/api/auth/login', {
  method: 'POST',
  credentials: 'include',  // Important for cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123456'
  })
});

// Get profile (cookies sent automatically)
const profileResponse = await fetch('http://localhost:4005/api/auth/profile', {
  credentials: 'include'
});
```

---

## Postman Collection

Import the Postman collection for easy API testing:
1. Copy the API endpoints from this documentation
2. Set up environment variables for base URL
3. Enable cookie handling in Postman settings

---

## Next Steps

- [Authentication Flow](./authentication-flow.md) - Understand how auth works
- [Error Handling](./error-handling.md) - Detailed error responses
- [Security](./security.md) - Security best practices
