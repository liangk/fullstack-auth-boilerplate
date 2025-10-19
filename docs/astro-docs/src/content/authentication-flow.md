# Authentication Flow

Complete guide to understanding authentication in the Fullstack Auth Boilerplate.

## Overview

This project implements secure JWT-based authentication using HTTP-only cookies, refresh token rotation, and email verification. This approach is considered industry best practice and is used by companies like GitHub, Google, and Stripe.

## Why HTTP-Only Cookies?

### Traditional Approach (LocalStorage/SessionStorage)
```
❌ Vulnerable to XSS attacks
❌ Accessible by any JavaScript code
❌ No automatic CSRF protection
❌ Manual token management required
```

### Our Approach (HTTP-Only Cookies)
```
✅ Immune to XSS attacks (JavaScript can't access)
✅ Automatic CSRF protection (SameSite flag)
✅ Automatically sent with requests
✅ Secure flag for HTTPS-only transmission
✅ Browser handles token storage
```

## Token Strategy

### Access Token
- **Lifetime**: 15 minutes
- **Purpose**: Short-lived token for API requests
- **Storage**: HTTP-only cookie
- **Contains**: User ID, token version

### Refresh Token
- **Lifetime**: 7 days
- **Purpose**: Generate new access tokens
- **Storage**: HTTP-only cookie (separate)
- **Contains**: User ID, token version

### Why Two Tokens?

**Short-lived access tokens** minimize risk if compromised (expires in 15 min).  
**Long-lived refresh tokens** provide good UX (stay logged in for 7 days).  
**Automatic refresh** happens behind the scenes when access token expires.

## Complete Authentication Flows

### 1. User Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────┘

User fills form:
  ├─ Email: user@example.com
  ├─ Password: SecurePass123
  └─ Name: John Doe (optional)
          │
          ▼
    [Submit Form]
          │
          ▼
┌─────────────────────┐
│   Frontend          │
│   Validation        │
│                     │
│ - Email format      │
│ - Password strength │
│ - Required fields   │
└─────────────────────┘
          │
          ▼ POST /api/auth/register
┌─────────────────────┐
│   Backend           │
│   Validation        │
│                     │
│ - Email unique?     │
│ - Password rules    │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Hash Password     │
│                     │
│   bcrypt.hash()     │
│   (10 rounds)       │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Create User       │
│   in Database       │
│                     │
│ - id: UUID          │
│ - emailVerified: F  │
│ - tokenVersion: 0   │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Generate Token    │
│                     │
│ JWT with:           │
│ - userId            │
│ - purpose: verify   │
│ - exp: 24h          │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Send Email        │
│                     │
│ To: user@example    │
│ Subject: Verify     │
│ Link: /verify?token │
└─────────────────────┘
          │
          ▼
    Response: 201
    {
      "message": "Registration successful. 
                  Check your email.",
      "userId": "uuid-string"
    }
```

### 2. Email Verification Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  EMAIL VERIFICATION FLOW                     │
└─────────────────────────────────────────────────────────────┘

User clicks link in email:
  └─ https://app.com/verify-email?token=xxx.yyy.zzz
          │
          ▼
┌─────────────────────┐
│   Frontend          │
│   Extracts Token    │
│   from URL          │
└─────────────────────┘
          │
          ▼ GET /api/auth/verify-email?token=xxx
┌─────────────────────┐
│   Backend           │
│   Verify JWT        │
│                     │
│ - Signature valid?  │
│ - Not expired?      │
│ - Purpose: verify?  │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Find User         │
│   by ID from token  │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Update User       │
│                     │
│ emailVerified = true│
└─────────────────────┘
          │
          ▼
    Response: 200
    {
      "message": "Email verified successfully"
    }
          │
          ▼
    Redirect to /login
```

### 3. Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        LOGIN FLOW                            │
└─────────────────────────────────────────────────────────────┘

User enters credentials:
  ├─ Email: user@example.com
  └─ Password: SecurePass123
          │
          ▼
    [Submit Login Form]
          │
          ▼ POST /api/auth/login
┌─────────────────────┐
│   Backend           │
│   Find User         │
│                     │
│ - By email          │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Verify Password   │
│                     │
│ bcrypt.compare()    │
│ plaintext vs hash   │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Check Email       │
│   Verified          │
│                     │
│ if (!emailVerified) │
│   return 403        │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Generate Tokens   │
│                     │
│ Access Token:       │
│ - exp: 15 min       │
│ - userId            │
│ - tokenVersion      │
│                     │
│ Refresh Token:      │
│ - exp: 7 days       │
│ - userId            │
│ - tokenVersion      │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Set Cookies       │
│                     │
│ access_token:       │
│ - httpOnly: true    │
│ - secure: true      │
│ - sameSite: strict  │
│ - maxAge: 15min     │
│                     │
│ refresh_token:      │
│ - httpOnly: true    │
│ - secure: true      │
│ - sameSite: strict  │
│ - maxAge: 7days     │
└─────────────────────┘
          │
          ▼
    Response: 200
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "emailVerified": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
```

### 4. Protected Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   PROTECTED REQUEST FLOW                     │
└─────────────────────────────────────────────────────────────┘

User makes request to protected route:
  └─ GET /api/dashboard/stats
          │
          │ (Browser automatically sends cookies)
          │
          ▼
┌─────────────────────┐
│   Backend           │
│   Extract Cookie    │
│                     │
│ req.cookies         │
│   .access_token     │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Verify JWT        │
│                     │
│ jwt.verify()        │
│ - Signature valid?  │
│ - Not expired?      │
└─────────────────────┘
          │
          ├─ Invalid/Expired
          │   └─> 401 Unauthorized
          │
          ▼ Valid
┌─────────────────────┐
│   Check Token       │
│   Version           │
│                     │
│ Compare token ver   │
│ with user.tokenVer  │
└─────────────────────┘
          │
          ├─ Mismatch (session invalidated)
          │   └─> 401 Unauthorized
          │
          ▼ Match
┌─────────────────────┐
│   Attach User       │
│   to Request        │
│                     │
│ req.user = decoded  │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Process Request   │
│   (Controller)      │
└─────────────────────┘
          │
          ▼
    Response: 200
    { data: ... }
```

### 5. Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    TOKEN REFRESH FLOW                        │
└─────────────────────────────────────────────────────────────┘

Access token expires (15 min)
          │
          ▼
User makes request
          │
          ▼
    Backend returns 401
          │
          ▼
┌─────────────────────┐
│   Frontend          │
│   Detects 401       │
│                     │
│ HTTP Interceptor    │
└─────────────────────┘
          │
          ▼ POST /api/auth/refresh
┌─────────────────────┐
│   Backend           │
│   Extract Refresh   │
│   Token from Cookie │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Verify Refresh    │
│   Token JWT         │
│                     │
│ - Signature valid?  │
│ - Not expired?      │
└─────────────────────┘
          │
          ├─ Invalid/Expired
          │   └─> 401 (user must login again)
          │
          ▼ Valid
┌─────────────────────┐
│   Check Token       │
│   Version           │
└─────────────────────┘
          │
          ├─ Mismatch
          │   └─> 401 (session invalidated)
          │
          ▼ Match
┌─────────────────────┐
│   Generate New      │
│   Access Token      │
│                     │
│ exp: 15 min         │
│ userId              │
│ tokenVersion        │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   OPTIONAL:         │
│   Rotate Refresh    │
│   Token             │
│                     │
│ (Extra security)    │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Set New Cookie    │
│                     │
│ access_token:       │
│ - new JWT           │
└─────────────────────┘
          │
          ▼
    Response: 200
    (empty, cookie set)
          │
          ▼
┌─────────────────────┐
│   Frontend          │
│   Retry Original    │
│   Request           │
│                     │
│ (automatically)     │
└─────────────────────┘
```

### 6. Logout Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       LOGOUT FLOW                            │
└─────────────────────────────────────────────────────────────┘

User clicks logout button
          │
          ▼ POST /api/auth/logout
┌─────────────────────┐
│   Backend           │
│   Verify Auth       │
│   (optional)        │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Clear Cookies     │
│                     │
│ res.clearCookie(    │
│   'access_token'    │
│ )                   │
│ res.clearCookie(    │
│   'refresh_token'   │
│ )                   │
└─────────────────────┘
          │
          ▼
    Response: 200
    {
      "message": "Logged out successfully"
    }
          │
          ▼
┌─────────────────────┐
│   Frontend          │
│   Clear State       │
│                     │
│ isAuthenticated$    │
│   .next(false)      │
└─────────────────────┘
          │
          ▼
    Redirect to /login
```

### 7. Password Reset Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   PASSWORD RESET FLOW                        │
└─────────────────────────────────────────────────────────────┘

Step 1: Request Reset
━━━━━━━━━━━━━━━━━━━━━━

User enters email
          │
          ▼ POST /api/auth/forgot-password
┌─────────────────────┐
│   Find User         │
│   by Email          │
│                     │
│ (Always return 200  │
│  even if not found) │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Generate Token    │
│                     │
│ JWT with:           │
│ - userId            │
│ - purpose: reset    │
│ - exp: 1h           │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Send Email        │
│                     │
│ To: user email      │
│ Link: /reset?token  │
└─────────────────────┘
          │
          ▼
    Response: 200
    {
      "message": "Reset email sent"
    }


Step 2: Reset Password
━━━━━━━━━━━━━━━━━━━━━━

User clicks link in email
  └─ https://app.com/reset-password?token=xxx
          │
          ▼
User enters new password
          │
          ▼ POST /api/auth/reset-password
┌─────────────────────┐
│   Verify Token      │
│                     │
│ - Signature valid?  │
│ - Not expired?      │
│ - Purpose: reset?   │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Find User         │
│   by ID from token  │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Hash New Password │
│                     │
│ bcrypt.hash()       │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Update User       │
│                     │
│ - password = hash   │
│ - tokenVersion++    │
│   (invalidate all   │
│    existing tokens) │
└─────────────────────┘
          │
          ▼
    Response: 200
    {
      "message": "Password reset successful"
    }
          │
          ▼
    Redirect to /login
```

## Security Measures

### 1. Password Hashing
```javascript
// Never store plain passwords
const hashedPassword = await bcrypt.hash(password, 10);

// Always compare hashed
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### 2. JWT Signing
```javascript
const token = jwt.sign(
  { userId: user.id, tokenVersion: user.tokenVersion },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: '15m' }
);
```

### 3. Cookie Configuration
```javascript
res.cookie('access_token', token, {
  httpOnly: true,      // No JavaScript access
  secure: IS_PROD,     // HTTPS only in production
  sameSite: 'strict',  // CSRF protection
  maxAge: 15 * 60 * 1000,  // 15 minutes
  path: '/'
});
```

### 4. Token Version (Session Invalidation)

When security events occur (password change, logout all devices), increment `tokenVersion`:

```typescript
// Invalidate all existing tokens
await prisma.user.update({
  where: { id: userId },
  data: { tokenVersion: { increment: 1 } }
});
```

All tokens with old version become invalid immediately.

### 5. Email Verification

Users cannot login until email is verified:

```typescript
if (!user.emailVerified) {
  return res.status(403).json({ 
    error: 'Please verify your email before logging in' 
  });
}
```

## Frontend Integration

### Auth Service

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated$.asObservable();

  login(credentials: LoginRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.base}/login`, credentials, {
      withCredentials: true  // Send cookies
    }).pipe(
      tap(() => this._isAuthenticated$.next(true))
    );
  }

  checkAuth(): Observable<boolean> {
    return this.http.get<UserProfile>(`${this.base}/profile`, {
      withCredentials: true
    }).pipe(
      tap(() => this._isAuthenticated$.next(true)),
      map(() => true),
      catchError(() => {
        this._isAuthenticated$.next(false);
        return of(false);
      })
    );
  }
}
```

### Route Guard

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    const isAuth = await firstValueFrom(this.auth.checkAuth());
    if (!isAuth) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
```

### Protected Routes

```typescript
export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { 
    path: 'dashboard', 
    component: DashboardPage, 
    canActivate: [AuthGuard]  // Protected
  },
  { 
    path: 'profile', 
    component: ProfilePage, 
    canActivate: [AuthGuard]  // Protected
  }
];
```

## Token Expiry Handling

### Automatic Refresh

```typescript
// HTTP Interceptor (conceptual)
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return next.handle(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Try to refresh token
        return this.auth.refresh().pipe(
          switchMap(() => {
            // Retry original request
            return next.handle(req);
          }),
          catchError(() => {
            // Refresh failed, redirect to login
            this.router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
}
```

## Best Practices Implemented

✅ **HTTP-only cookies** - XSS protection  
✅ **Short-lived access tokens** - Minimize risk  
✅ **Long-lived refresh tokens** - Good UX  
✅ **Token versioning** - Invalidate all sessions  
✅ **Email verification** - Confirm user identity  
✅ **Password reset with expiry** - Secure reset flow  
✅ **Bcrypt hashing** - Secure password storage  
✅ **JWT signing** - Token integrity  
✅ **CORS configuration** - Origin validation  
✅ **Rate limiting** - Prevent brute force  

## Common Pitfalls Avoided

❌ **Storing tokens in localStorage** → ✅ HTTP-only cookies  
❌ **Long-lived access tokens** → ✅ 15-minute expiry  
❌ **No token rotation** → ✅ Refresh token rotation  
❌ **Plain text passwords** → ✅ Bcrypt hashing  
❌ **No email verification** → ✅ Required before login  
❌ **No session invalidation** → ✅ Token versioning  
❌ **Weak password policies** → ✅ Strong validation  

## Testing Authentication

See [Testing Guide](./testing.md) for comprehensive test examples.

## Related Documentation

- [API Reference](./api-reference.md) - Auth endpoints
- [Security Guide](./security.md) - Security measures
- [Frontend Architecture](./frontend-architecture.md) - Frontend implementation
- [Backend Architecture](./backend-architecture.md) - Backend implementation
