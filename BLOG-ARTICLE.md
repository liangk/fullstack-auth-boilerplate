---
title: "Modern Fullstack Authentication Boilerplate: Complete Guide 2025"
description: "Build secure authentication with Angular, Express, PostgreSQL. Features JWT HTTP-only cookies, refresh token rotation, and TypeScript. Complete starter kit with best practices."
keywords: "fullstack authentication, Angular Express authentication, JWT HTTP-only cookies, refresh token rotation, TypeScript authentication boilerplate, secure login system, PostgreSQL authentication, Angular Material login"
date: "2025-09-02"
author: "Ko-Hsin Liang"
categories: ["Authentication", "Angular", "Express", "Security", "TypeScript"]
tags: ["JWT", "HTTP-only cookies", "Prisma", "PostgreSQL", "Angular Material", "refresh tokens"]
---

# Modern Fullstack Authentication Boilerplate: A Comprehensive Guide  
**Secure Angular + Express + PostgreSQL Starter with HTTP-only Cookies**

## 🎯 Quick Summary
**Problem**: Most authentication tutorials store JWTs in localStorage (vulnerable to XSS attacks)  
**Solution**: This boilerplate uses HTTP-only cookies with refresh token rotation for maximum security  
**Result**: Production-ready authentication system you can deploy immediately

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

## 🎯 What You'll Learn
- ✅ **Security-first authentication** with HTTP-only cookies
- ✅ **Complete implementation** from database to UI
- ✅ **Production deployment** checklist and best practices
- ✅ **Extension strategies** for OAuth, 2FA, and role-based access
- ✅ **Performance optimization** techniques
- ✅ **Common troubleshooting** solutions

---

## 🚀 What Is This Boilerplate?

The **Fullstack Auth Boilerplate** is not just another "login form + Express API" starter. It's a thoughtfully designed, secure-by-default foundation that reflects real-world best practices.

It includes:
- ✅ User registration & login
- ✅ JWT in **HTTP-only, SameSite cookies** (no localStorage)
- ✅ Refresh token rotation
- ✅ Protected routes (frontend and backend)
- ✅ Type-safe API with **Zod** and **TypeScript**
- ✅ Clean UI with **Angular Material**
- ✅ Database modeling with **Prisma ORM**
- ✅ Automatic token refresh
- ✅ CORS and environment configuration
- ✅ bcrypt password hashing
- ✅ Email verification
- ✅ Secure password reset
- ✅ Dockerized for easy setup
- ✅ CI/CD pipelines for quality assurance

No Firebase. No Auth0. No third-party dependencies for auth.

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
- User fills out email and password in an Angular Material form.
- Form validation ensures valid input.
- Data sent to `POST /api/auth/register`.

**Backend (Express)**:
```ts
const hashedPassword = await bcrypt.hash(password, 10);
await prisma.user.create({
  data: { email, password: hashedPassword }
});
```
- Password is hashed with `bcrypt` (salt + slow hash).
- User saved to PostgreSQL.

✅ No token returned — user must log in.

---

### 2. **Login**

**Frontend**:
- Sends credentials to `POST /api/auth/login`.

**Backend**:
```ts
// Validate credentials
const user = await prisma.user.findUnique({ where: { email } });
if (!user || !await bcrypt.compare(password, user.password)) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

// Generate tokens
const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

// Store refresh token in DB
await prisma.refreshToken.create({
  data: {
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});

// Set HTTP-only cookie
res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000
});
```

✅ Access token in HTTP-only cookie  
✅ Refresh token stored in database

---

### 3. **Protected Routes**

**Frontend (Angular Guard)**:
```ts
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(): Promise<boolean> {
    const res = await fetch('/api/auth/me');
    if (res.ok) return true;
    this.router.navigate(['/login']);
    return false;
  }
}
```

**Backend (Middleware)**:
```ts
export const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: 'No token' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = payload.userId;
    next();
  });
};
```

✅ Route protection on both sides  
✅ `/me` endpoint returns current user

---

### 4. **Token Refresh (Silent Reauthentication)**

Access tokens expire every 15 minutes. But users shouldn't log in every 15 minutes.

So we use **refresh tokens**:

**Frontend**:
- Detects 401 (token expired)
- Calls `POST /api/auth/refresh`

**Backend**:
```ts
const refreshToken = req.cookies.refreshToken;
const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });

if (!stored || stored.expiresAt < new Date()) {
  return res.status(401).json({ error: 'Refresh token invalid' });
}

// Rotate: delete old, create new
await prisma.refreshToken.delete({ where: { token: refreshToken } });
const newRefreshToken = jwt.sign({ userId: stored.userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
await prisma.refreshToken.create({
  data: {
    token: newRefreshToken,
    userId: stored.userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});

// Issue new access token
const newAccessToken = jwt.sign({ userId: stored.userId }, JWT_SECRET, { expiresIn: '15m' });
res.cookie('accessToken', newAccessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000
});
```

✅ **Refresh token rotation** prevents replay attacks  
✅ User stays logged in seamlessly

---

### 5. **Logout**

```ts
// Remove refresh token from DB
await prisma.refreshToken.deleteMany({ where: { userId: req.userId } });

// Clear cookie
res.clearCookie('accessToken');
res.clearCookie('refreshToken');
```

✅ Session fully invalidated  
✅ No lingering tokens

---

### 6. **Email Verification**

To ensure users own their email addresses, the boilerplate includes an email verification flow.

**Backend (On Registration)**:
```ts
// After user creation
const verificationToken = signEmailVerificationToken(user.id);
await sendVerificationEmail(email, verificationToken);
```
- A short-lived, secure token is generated.
- An email is sent to the user with a verification link.
- Users cannot log in until their email is verified.

**Backend (On Verification)**:
- The `GET /api/auth/verify-email` endpoint receives the token.
- The token is validated, and the user's `emailVerified` field is set to `true`.

✅ Prevents fake user sign-ups and ensures a valid communication channel.

---

### 7. **Password Reset**

A secure password reset flow is included for users who forget their password.

**Step 1: Forgot Password**
- User enters their email and submits to `POST /api/auth/forgot-password`.
- **Backend**:
  ```ts
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const resetToken = signPasswordResetToken(user.id);
    await sendPasswordResetEmail(email, resetToken);
  }
  // Always return a generic success message
  res.json({ message: 'If an account exists, a reset link has been sent.' });
  ```
- This prevents attackers from discovering which emails are registered.

**Step 2: Reset Password**
- The user clicks the link in the email, which leads to a form on the frontend.
- The form submits the new password and token to `POST /api/auth/reset-password`.
- **Backend**:
  ```ts
  // Verify the password reset token
  const payload = verifyPasswordResetToken(token);
  
  // Hash the new password
  const passwordHash = await bcrypt.hash(password, 12);

  // Update password and invalidate all existing sessions
  await prisma.user.update({
    where: { id: payload.sub },
    data: {
      password: passwordHash,
      tokenVersion: { increment: 1 }, // Invalidates old refresh tokens
    },
  });
  ```
✅ Invalidating old sessions on password reset is a critical security step to log out any potentially compromised devices.

---

## 🛠️ Tech Stack Deep Dive

### Frontend: Angular + Angular Material
- **Angular 17+**: Modern change detection, standalone components, and reactive forms.
- **Angular Material**: `mat-card`, `mat-form-field`, `mat-input`, `mat-button` — consistent, accessible UI.
- **Type Safety**: Services use typed HTTP clients.
- **Route Guards**: `AuthGuard` protects dashboard routes.

### Backend: Express + TypeScript + Zod
- **Express**: Lightweight, flexible, and widely supported.
- **TypeScript**: Shared types with frontend.
- **Zod**: Runtime validation for all API inputs:
  ```ts
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });
  ```
- **Prisma ORM**: Type-safe database queries and migrations.

### Database: PostgreSQL + Prisma
```prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String
  tokens   RefreshToken[]
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
}
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
JWT_SECRET=your_strong_jwt_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here
NODE_ENV=development
PORT=5000
```

> 🔐 Use strong, randomly generated values for JWT secrets in production.

**`frontend/src/environments/environment.ts`**:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'
};
```

### Step 5: Run Prisma Migrations
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

This creates the `User` and `RefreshToken` tables in your database.

### Step 6: Start Servers
```bash
# Backend
npm run dev

# Frontend
cd ../frontend
ng serve
```

👉 **Frontend**: http://localhost:4200  
👉 **Backend API**: http://localhost:5000/api/auth/me (protected)

You can now:
- Register a new user
- Log in
- Access protected routes
- Test token refresh

---

## 🐳 Dockerized Development

For an even faster setup, the boilerplate includes a comprehensive Docker configuration that runs the entire stack—frontend, backend, database, and a local email server—with a single command.

### Quick Start with Docker

Instead of setting up a local PostgreSQL instance and managing environment variables manually, you can use the provided helper script.

**Prerequisites**: Docker and Docker Compose installed.

**Start Everything**:
```bash
./docker-dev.sh start
```

This command will:
- 🐳 Build the Docker images for the frontend and backend.
- 🚀 Start all services defined in `docker-compose.yml`.
- 🔗 Connect the backend to the PostgreSQL database and MailDev email server.

Your full development environment is now running:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:4000`
- **MailDev (Email Viewer)**: `http://localhost:1080`

### Docker Helper Script (`docker-dev.sh`)

The `docker-dev.sh` script provides several useful commands for managing your development environment:

| Command | Description |
|---|---|
| `./docker-dev.sh start` | Starts all services in the foreground. |
| `./docker-dev.sh start-bg` | Starts all services in the background (detached mode). |
| `./docker-dev.sh stop` | Stops all running services. |
| `./docker-dev.sh logs` | Tails the logs from all running services. |
| `./docker-dev.sh migrate` | Runs Prisma database migrations inside the backend container. |
| `./docker-dev.sh clean` | Stops and removes all containers, volumes, and networks. |
| `./docker-dev.sh shell` | Opens a shell inside the running backend container for debugging. |

This Docker setup is perfect for ensuring a consistent and reproducible development environment for your entire team.

---

## ⚙️ Continuous Integration (CI)

To maintain code quality and prevent bugs, the boilerplate comes with pre-configured CI pipelines for both the frontend and backend using **GitHub Actions**.

These workflows are defined in the `.github/workflows/` directory and automatically run on every `push` and `pull_request` to the `main` and `develop` branches.

### Backend CI (`backend-ci.yml`)

The backend pipeline performs the following checks:
- **Linting**: Enforces a consistent code style with ESLint.
- **Formatting**: Checks for code formatting issues with Prettier.
- **Prisma Validation**: Ensures the Prisma schema is valid.
- **Unit & Integration Tests**: Runs the full test suite using a dedicated test database.
- **Code Coverage**: Uploads test coverage reports to Codecov to track test quality over time.

### Frontend CI (`frontend-ci.yml`)

The frontend pipeline ensures the application is always in a buildable state:
- **Linting**: Checks for code quality issues with ESLint.
- **Building**: Compiles the Angular application to ensure there are no build errors.

This automated setup catches errors early, enforces best practices, and allows you to ship features with confidence.

---

## 🛡️ Security Best Practices Implemented

| Practice | Implemented? | Why It Matters |
|--------|--------------|---------------|
| HTTP-only cookies | ✅ | Prevents XSS token theft |
| Secure flag | ✅ (in production) | HTTPS-only |
| SameSite=strict | ✅ | Prevents CSRF |
| bcrypt hashing | ✅ | Secure password storage |
| Refresh token rotation | ✅ | Prevents replay attacks |
| Zod validation | ✅ | Prevents injection |
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

### 3. Add 2FA
- TOTP (Google Authenticator) or SMS
- Store `twoFactorSecret` in DB

### 4. Add Audit Logs
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

## ❓ Frequently Asked Questions

### Q: Why use HTTP-only cookies instead of localStorage for JWTs?
**A:** HTTP-only cookies prevent XSS attacks because they're inaccessible to JavaScript. localStorage can be read by any script, making it vulnerable to token theft.

### Q: How does refresh token rotation work?
**A:** Each time a refresh token is used, it's deleted and replaced with a new one. This prevents replay attacks and limits the impact of token compromise.

### Q: Can I use this with React or Vue instead of Angular?
**A:** Yes! The backend is framework-agnostic. You'd need to adapt the frontend authentication logic and guards for your chosen framework.

### Q: How does the password reset functionality work?
**A:** The boilerplate includes a full password reset flow. A user can request a reset link, which is emailed to them. The link contains a secure, short-lived token. When the user sets a new password, all their other active sessions are automatically logged out for security.

### Q: How do I add role-based access control?
**A:** Add a `role` field to the User model and create middleware to check user roles before accessing protected routes.

### Q: Is this production-ready?
**A:** Yes, with proper environment configuration and HTTPS. Follow the production checklist for deployment best practices.

### Q: How do I handle multiple devices/sessions?
**A:** The current implementation allows multiple sessions. To limit this, store session IDs and implement device management.

### Q: What's the difference between access and refresh tokens?
**A:** Access tokens are short-lived (15 minutes) for API requests. Refresh tokens are long-lived (7 days) for generating new access tokens.

### Q: How do I add OAuth (Google, GitHub) login?
**A:** Use Passport.js strategies or @auth/core. Add provider fields to the User model and handle OAuth callbacks.

### Q: Can I deploy this on free hosting?
**A:** Yes! The frontend can be deployed to Netlify/Vercel, and the backend to Railway/Render. Use cloud databases like Neon or Supabase.

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