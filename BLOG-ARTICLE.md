# 🔐 Modern Fullstack Authentication Boilerplate: A Comprehensive Guide  
**Secure Angular + Express + PostgreSQL Starter with HTTP-only Cookies**

Authentication is one of the most critical—and often most misunderstood—parts of fullstack development. Get it wrong, and your app is vulnerable to XSS, CSRF, token theft, or session hijacking. Get it right, and you've still spent weeks on boilerplate before writing a single business feature.

That's why I built the **[Fullstack Auth Boilerplate](https://github.com/liangk/fullstack-auth-boilerplate)** — a secure, production-ready starter kit using **Angular**, **Express**, **PostgreSQL**, and **Prisma**, with authentication implemented the right way: **JWT in HTTP-only cookies**, refresh token rotation, and end-to-end TypeScript.

👉 **GitHub Repo**: [https://github.com/liangk/fullstack-auth-boilerplate](https://github.com/liangk/fullstack-auth-boilerplate)

In this **comprehensive guide**, you'll learn:
- Why this boilerplate is different from typical starters
- How secure authentication works under the hood
- A deep dive into each layer (frontend, backend, database)
- Best practices for security and scalability
- How to run it locally and deploy it
- How to extend it for your next project

Whether you're building an admin dashboard, internal tool, or SaaS platform, this guide will help you **build faster and safer**.

---

## 🚀 What Is This Boilerplate?

The **Fullstack Auth Boilerplate** is not just another "login form + Express API" starter. It's a thoughtfully designed, secure-by-default foundation that reflects real-world best practices.

It includes:
- ✅ User registration & login
- ✅ JWT in **HTTP-only, SameSite cookies** (no localStorage)
- ✅ Refresh token rotation
- ✅ Protected routes (frontend and backend)
- ✅ Type-safe API with **TypeScript** and **express-validator**
- ✅ Clean UI with **Angular Material**
- ✅ Database modeling with **Prisma ORM**
- ✅ Automatic token refresh
- ✅ CORS and environment configuration
- ✅ bcrypt password hashing

No Firebase. No Auth0. No email services. No third-party dependencies for auth.

Just pure, secure, and customizable code you fully control.

This is the starter I wish I had when I began building fullstack apps.

---

## 🔐 Why This Approach? The Problem with Common Auth Patterns

Before we dive in, let's address why this boilerplate **does things differently**—and why those differences matter.

### ❌ The Problem: Storing JWTs in `localStorage`

Most tutorials (and even production apps) store JWTs in `localStorage` or `sessionStorage`. Example:

```ts
localStorage.setItem('token', jwt);
```

But this is **dangerous** because:
- `localStorage` is accessible via JavaScript
- If an attacker injects a script (XSS), they can steal the token
- Once stolen, the attacker can impersonate the user indefinitely

> 🚨 **localStorage is not secure for tokens** — it's a common anti-pattern.

### ✅ The Solution: HTTP-only Cookies

This boilerplate uses **HTTP-only cookies** to store JWTs:

```http
Set-Cookie: accessToken=abc123; HttpOnly; Secure; SameSite=Strict
```

Benefits:
- ❌ **Inaccessible to JavaScript** → immune to XSS
- ✅ Automatically sent with requests
- ✅ Can be scoped with `Secure` (HTTPS-only) and `SameSite` flags
- ✅ Supported by all modern browsers

This is the **industry-standard** way to handle session tokens—used by GitHub, Google, and most security-conscious platforms.

---

## 🧱 Architecture Overview

Here's how the system is structured:

```
+-------------------+       +------------------+
|                   |       |                  |
|   Angular App     |<----->|   Express API    |
| (Angular Material)|  HTTPS  (TypeScript)    |
|                   |       |                  |
+-------------------+       +------------------+
                                |
                                | Prisma ORM
                                v
                         +------------------+
                         |   PostgreSQL     |
                         | (User, RefreshToken) |
                         +------------------+
```

### Key Components:
- **Frontend**: Angular handles UI, form validation, and route protection.
- **Backend**: Express validates credentials, issues tokens, and protects routes.
- **Database**: Stores users and refresh tokens securely.
- **Auth Flow**: JWT in HTTP-only cookies + refresh token rotation.

---

## 🔐 Deep Dive: How Authentication Works

Let's walk through the full authentication lifecycle.

### 1. **User Registration**

**Frontend (Angular)**:
```typescript
// register.component.ts
register() {
  this.authService.register(this.registerForm.value).subscribe({
    next: () => {
      // Automatically logged in after registration
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.error = err.message;
    }
  });
}
```

**Backend (Express)**:
```typescript
// authController.ts
export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  
  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { 
      email, 
      password: passwordHash, 
      name,
      tokenVersion: 0  // Initialize token version
    },
    select: { 
      id: true, 
      email: true, 
      name: true, 
      createdAt: true 
    }
  });

  // Generate tokens and set cookies (same as login)
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id, 0);
  
  // Set HTTP-only cookies
  setAccessCookie(res, accessToken);
  setRefreshCookie(res, refreshToken);

  res.status(201).json({ user });
}
```

✅ User is registered and immediately authenticated  
✅ Password securely hashed with bcrypt  
✅ Tokens set in HTTP-only cookies

---

### 2. **Login**

**Frontend (Angular)**:
```typescript
// login.component.ts
login() {
  this.authService.login(this.loginForm.value).subscribe({
    next: () => {
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.error = err.message;
    }
  });
}
```

**Backend (Express)**:
```typescript
// authController.ts
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate tokens
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id, user.tokenVersion);
  
  // Set HTTP-only cookies
  setAccessCookie(res, accessToken);
  setRefreshCookie(res, refreshToken);

  res.json({ user });
}
```

✅ Access token in HTTP-only cookie  
✅ Refresh token stored in database

---

### 3. **Protected Routes**

**Frontend (Angular Guard)**:
```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  return auth.checkAuth().pipe(
    tap(isAuthed => {
      if (!isAuthed) router.navigate(['/login']);
    }),
    map(isAuthed => isAuthed)
  );
};

// Usage in routes:
const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] 
  }
];
```

**Backend (Middleware)**:
```typescript
// requireAuth.ts
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.['access_token'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    return next();
  } catch (_e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Usage in routes:
router.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'Protected data' });
});
```

✅ Route protection on both sides  
✅ `/me` endpoint returns current user

---

### 4. **Token Refresh (Silent Reauthentication)**

Access tokens expire every 15 minutes. But users shouldn't log in every 15 minutes.

So we use **refresh tokens**:

**Frontend**:
- Uses an HTTP interceptor to detect 401 responses
- Automatically calls `POST /api/auth/refresh` to get a new access token
- Retries the original request with the new token

**Backend**:
```typescript
// authController.ts
export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the refresh token and extract the user ID and token version
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { sub: string; tv: number };
    
    // Get the user and verify the token version matches
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.tokenVersion !== payload.tv) {
      return res.status(401).json({ message: 'Token invalidated' });
    }

    // Issue a new access token
    const accessToken = jwt.sign({ sub: user.id }, JWT_ACCESS_SECRET, { 
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' 
    });
    
    // Set the new access token in an HTTP-only cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/'
    });
    
    return res.json({ message: 'Token refreshed' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}
```

✅ **Token versioning** prevents replay attacks when users log out  
✅ User stays logged in seamlessly

---

### 5. **Logout**

```typescript
// Invalidate all user's refresh tokens by incrementing tokenVersion
await prisma.user.update({
  where: { id: req.userId },
  data: { tokenVersion: { increment: 1 } }
});

// Clear cookies
res.clearCookie('access_token', { path: '/' });
res.clearCookie('refresh_token', { path: '/' });
```

✅ Session fully invalidated  
✅ No lingering tokens

---

## 🛠️ Tech Stack Deep Dive

### Frontend: Angular + Angular Material
- **Angular 20**: Modern change detection, standalone components, and reactive forms.
- **Angular Material**: `mat-card`, `mat-form-field`, `mat-input`, `mat-button` — consistent, accessible UI.
- **Type Safety**: Services use typed HTTP clients with interceptors.
- **Route Guards**: `authGuard` protects dashboard routes.
- **HTTP Interceptors**: Automatic token refresh on 401 responses.
- **Reactive State**: `BehaviorSubject` for auth state management.

### Backend: Express + TypeScript + Express-Validator
- **Express**: Lightweight, flexible, and widely supported.
- **TypeScript**: Shared types with frontend.
- **Express-Validator**: Request validation middleware:
  ```typescript
  // In authRoutes.ts
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password')
      .isStrongPassword({ 
        minLength: 8, 
        minLowercase: 1, 
        minUppercase: 1, 
        minNumbers: 1 
      })
      .withMessage('Password must be at least 8 chars with upper, lower, and number')
  ]
  ```
- **Prisma ORM**: Type-safe database queries and migrations.

### Database: PostgreSQL + Prisma
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  password     String
  name         String?
  tokenVersion Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// Token versioning is used to invalidate refresh tokens on logout
// When a user logs out, tokenVersion is incremented, invalidating all existing refresh tokens
```

✅ Schema enforces data integrity  
✅ Prisma Migrate handles versioning

---

## 🚦 How to Run It Locally

### Step 1: Clone the Repo
```bash
git clone https://github.com/liangk/fullstack-auth-boilerplate.git
cd fullstack-auth-boilerplate
```

### Step 2: Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 3: Set Up PostgreSQL

Ensure you have PostgreSQL running locally (or use a cloud instance like Neon, Supabase, etc.).

Create a database:
```sql
CREATE DATABASE authdb;
```

### Step 4: Environment Variables

**`backend/.env`**:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/authdb"
JWT_ACCESS_SECRET=your_strong_jwt_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CORS_ORIGIN=http://localhost:4200
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CORS_ORIGIN=http://localhost:4200
NODE_ENV=development
PORT=4000
```

> 🔐 For production, set `NODE_ENV=production` and ensure all secrets are strong and secure.

> 🔐 Use strong, randomly generated values for JWT secrets in production.

**`frontend/src/environments/environment.ts`**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api'  // Matches the backend port and API prefix
};
```

For development, use `environment.development.ts` which extends this configuration.

### Step 5: Run Prisma Migrations
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

This creates the `User` and `RefreshToken` tables in your database.

### Step 6: Start Servers

In separate terminals:

```bash
# Backend (from backend/ directory)
npm run dev

# Frontend (from frontend/ directory)
npm start  # Uses proxy config to forward /api to backend
```

👉 **Frontend**: http://localhost:4200  
👉 **Backend API**: http://localhost:4000/api  
👉 **Auth Endpoint**: http://localhost:4000/api/auth/me (protected)

You can now:
- Register a new user
- Log in
- Access protected routes
- Test token refresh

---

## 🛡️ Security Best Practices Implemented

| Practice | Implemented? | Why It Matters |
|--------|--------------|---------------|
| HTTP-only cookies | ✅ | Prevents XSS token theft |
| Secure flag | ✅ (in production) | HTTPS-only |
| SameSite=lax (dev) / none (prod) | ✅ | Balances security and OAuth compatibility |
| Token Versioning | ✅ | Invalidates all sessions on logout |
| Helmet | ✅ | Security headers |
| Rate Limiting | ✅ | Prevents brute force attacks |
| bcrypt hashing | ✅ | Secure password storage |
| Refresh token rotation | ✅ | Prevents replay attacks |
| Express-Validator | ✅ | Prevents injection and validates input |
| CORS configured | ✅ | Limits origin access |
| No localStorage | ✅ | Eliminates XSS risk |

---

## 🚀 How to Extend This Boilerplate

This is a **starter**, not a final product. Here's how to build on it:

### 1. Add OAuth (Google, GitHub)
- Use `@auth/core` or Passport.js
- Add `provider` and `providerId` to `User` model

### 2. Add Roles & Permissions
```prisma
enum Role { USER, ADMIN }
model User { ... role Role @default(USER) }
```
- Add middleware: `requireRole('ADMIN')`

### 3. Add Email Verification
- Send verification link on registration
- Add `emailVerified` boolean to `User`

### 4. Add 2FA
- TOTP (Google Authenticator) or SMS
- Store `twoFactorSecret` in DB

### 5. Add Audit Logs
- Log login attempts, token refreshes, etc.

---

## 🧰 Troubleshooting Tips

| Issue | Solution |
|------|---------|
| `P1001` (Can't reach database) | Ensure PostgreSQL is running and `DATABASE_URL` is correct |
| Token not set in cookie | Check `httpOnly`, `secure`, and domain settings |
| 401 on `/me` | Ensure cookie is sent (same origin, no CORS issues) |
| Prisma migration errors | Delete `migrations` folder and start over (dev only) |
| CORS error | Verify `cors` origin matches frontend URL |

---

## 📦 Production Checklist

Before deploying:
- 🔐 Use HTTPS (e.g., Let's Encrypt)
- 🗝️ Generate strong JWT secrets (use `openssl rand -base64 32`)
- 🌐 Set `secure: true` in cookie options
- 🧹 Run `npx prisma migrate deploy` in production
- 🐳 Use PM2, Docker, or a PaaS (Render, Railway, AWS, etc.)
- 🔄 Set up monitoring and logging
- 🧼 Never commit `.env` files to Git

---

## 🌟 Why This Over Auth0 or Firebase?

| Factor | This Boilerplate | Auth0/Firebase |
|-------|------------------|----------------|
| Cost | $0 (host your own) | Scales with users |
| Control | Full | Limited |
| Customization | Unlimited | Restricted |
| Data Ownership | Yours | Third-party |
| Learning Value | High | Abstracted |
| Offline Support | Yes | Partial |

Use this boilerplate if you want **control, clarity, and long-term maintainability**.

---

## 🤝 Contribute & Feedback

This project is open source (MIT licensed). I welcome your help!

- 🐛 Report bugs: [GitHub Issues](https://github.com/liangk/fullstack-auth-boilerplate/issues)
- 💡 Suggest features: OAuth, dark mode, audit logs
- 🛠️ Submit PRs: UI improvements, security hardening, docs

I'd love to see what you build with it!

---

## 📣 Final Thoughts

Authentication doesn't have to be a bottleneck. With the **[Fullstack Auth Boilerplate](https://github.com/liangk/fullstack-auth-boilerplate)**, you get a secure, modern, and well-documented foundation that handles the hard parts — so you can focus on building what makes your app unique.

It's minimal, but not minimalistic.  
Secure, but not complex.  
Built for developers who value **control**, **clarity**, and **correctness**.

👉 **Get started today**: [https://github.com/liangk/fullstack-auth-boilerplate](https://github.com/liangk/fullstack-auth-boilerplate)

⭐ Star it, use it, and tag me — I'd love to see your projects!

---

**Happy coding,**  
— LiangK

*Follow me on GitHub: [@liangk](https://github.com/liangk)*

---

### 👉 Enjoyed this guide?  
Clap, share, and follow for more fullstack deep dives, security tips, and Angular/Node.js guides.