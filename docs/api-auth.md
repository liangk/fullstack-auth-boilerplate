# Authentication API Endpoints

Complete reference for all authentication-related API endpoints in StackInsight Auth Lite.

## Base URL

- **Development**: `http://localhost:4005/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All endpoints use HTTP-only cookies for authentication. Cookies are automatically managed by the browser.

---

## Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Authentication:** Not required

**Rate Limit:** 5 requests per 15 minutes per IP

### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | Min 8 chars, 1 uppercase, 1 lowercase, 1 number |
| name | string | No | User's display name |

### Success Response

**Status:** `201 Created`

```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "clx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "isVerified": false,
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request** - Validation error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**409 Conflict** - Email already exists
```json
{
  "error": "User with this email already exists"
}
```

---

## Login

Authenticate user and receive tokens.

**Endpoint:** `POST /auth/login`

**Authentication:** Not required

**Rate Limit:** 5 requests per 15 minutes per IP

### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Success Response

**Status:** `200 OK`

Sets two HTTP-only cookies:
- `accessToken` - expires in 15 minutes
- `refreshToken` - expires in 7 days

```json
{
  "message": "Login successful",
  "user": {
    "id": "clx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "isVerified": true
  }
}
```

### Error Responses

**401 Unauthorized** - Invalid credentials
```json
{
  "error": "Invalid email or password"
}
```

**403 Forbidden** - Email not verified
```json
{
  "error": "Please verify your email before logging in"
}
```

---

## Logout

End user session and invalidate tokens.

**Endpoint:** `POST /auth/logout`

**Authentication:** Required (access token)

### Request Body

None

### Success Response

**Status:** `200 OK`

Clears authentication cookies.

```json
{
  "message": "Logged out successfully"
}
```

---

## Refresh Token

Obtain a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Authentication:** Required (refresh token cookie)

### Request Body

None (uses refresh token from cookie)

### Success Response

**Status:** `200 OK`

Sets new HTTP-only cookies with fresh tokens.

```json
{
  "message": "Token refreshed successfully"
}
```

### Error Responses

**401 Unauthorized** - Invalid or expired refresh token
```json
{
  "error": "Invalid refresh token"
}
```

---

## Verify Email

Verify user's email address using verification token.

**Endpoint:** `GET /auth/verify-email/:token`

**Authentication:** Not required

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| token | string | Email verification token from email link |

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Email verified successfully. You can now log in."
}
```

### Error Responses

**400 Bad Request** - Invalid or expired token
```json
{
  "error": "Invalid or expired verification token"
}
```

**404 Not Found** - User not found
```json
{
  "error": "User not found"
}
```

---

## Resend Verification Email

Request a new verification email.

**Endpoint:** `POST /auth/resend-verification`

**Authentication:** Not required

**Rate Limit:** 3 requests per 15 minutes per email

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Verification email sent. Please check your inbox."
}
```

### Error Responses

**400 Bad Request** - Email already verified
```json
{
  "error": "Email is already verified"
}
```

**404 Not Found** - User not found
```json
{
  "error": "User not found"
}
```

---

## Request Password Reset

Request a password reset email.

**Endpoint:** `POST /auth/forgot-password`

**Authentication:** Not required

**Rate Limit:** 3 requests per 15 minutes per email

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

**Note:** Always returns success (security measure to prevent email enumeration)

---

## Reset Password

Reset password using reset token.

**Endpoint:** `POST /auth/reset-password/:token`

**Authentication:** Not required

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| token | string | Password reset token from email link |

### Request Body

```json
{
  "newPassword": "NewSecurePass123"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Password reset successful. You can now log in with your new password."
}
```

### Error Responses

**400 Bad Request** - Invalid or expired token
```json
{
  "error": "Invalid or expired reset token"
}
```

**400 Bad Request** - Validation error
```json
{
  "error": "Password must be at least 8 characters"
}
```

---

## Change Password

Change password for authenticated user.

**Endpoint:** `PUT /auth/change-password`

**Authentication:** Required (access token)

### Request Body

```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Password changed successfully"
}
```

### Error Responses

**401 Unauthorized** - Current password incorrect
```json
{
  "error": "Current password is incorrect"
}
```

**400 Bad Request** - Validation error
```json
{
  "error": "New password must be different from current password"
}
```

---

## Get Current User

Retrieve authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Authentication:** Required (access token)

### Request Body

None

### Success Response

**Status:** `200 OK`

```json
{
  "user": {
    "id": "clx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "isVerified": true,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### Error Responses

**401 Unauthorized** - Not authenticated
```json
{
  "error": "Not authenticated"
}
```

---

## Update User Profile

Update authenticated user's profile information.

**Endpoint:** `PUT /auth/profile`

**Authentication:** Required (access token)

### Request Body

```json
{
  "name": "Jane Doe",
  "email": "newemail@example.com"
}
```

**Note:** If email is changed, user must verify the new email address.

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "clx123abc",
    "email": "newemail@example.com",
    "name": "Jane Doe",
    "isVerified": false
  }
}
```

### Error Responses

**409 Conflict** - Email already in use
```json
{
  "error": "Email is already in use"
}
```

---

## Delete Account

Delete authenticated user's account permanently.

**Endpoint:** `DELETE /auth/account`

**Authentication:** Required (access token)

### Request Body

```json
{
  "password": "UserPassword123"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "Account deleted successfully"
}
```

### Error Responses

**401 Unauthorized** - Password incorrect
```json
{
  "error": "Password is incorrect"
}
```

---

## Example Usage

### JavaScript/TypeScript (Angular/React)

```typescript
// Register
const response = await fetch('http://localhost:4005/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123',
    name: 'John Doe'
  })
});

// Login
const loginResponse = await fetch('http://localhost:4005/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123'
  })
});

// Get current user (cookies sent automatically)
const userResponse = await fetch('http://localhost:4005/api/auth/me', {
  credentials: 'include'
});
```

### cURL

```bash
# Register
curl -X POST http://localhost:4005/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123","name":"John Doe"}'

# Login (save cookies)
curl -X POST http://localhost:4005/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@example.com","password":"SecurePass123"}'

# Get current user (use saved cookies)
curl -X GET http://localhost:4005/api/auth/me \
  -b cookies.txt
```

## See Also

- [Authentication Flow](./authentication-flow.md) - Understanding the authentication process
- [Error Handling](./error-handling.md) - Complete error response reference
- [Security Best Practices](./security.md) - Security implementation details
