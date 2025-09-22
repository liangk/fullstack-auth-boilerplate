# Fullstack Auth Boilerplate

Modern fullstack authentication boilerplate featuring:

- Backend: Node.js, Express, Prisma (PostgreSQL), JWT access/refresh tokens, secure cookies, CORS, Helmet, rate limiting, validation
- Frontend: Angular (standalone components), Angular Material, ngx-lite-form for forms, responsive UI, form validation, snackbars

This project provides a clean starting point for building authenticated web applications with a modern tech stack.

## Features

- __JWT auth with refresh tokens__ using HTTP-only cookies
- __Email verification__ for account activation with secure JWT tokens
- __Password reset flow__ with secure reset links and session invalidation
- __Prisma ORM__ with PostgreSQL and a simple `User` model
- __Security hardening__: Helmet, CORS, rate limiting, auth-only refresh, input validation
- __Modern UI__: Clean, responsive design with Angular Material and custom styling
- __Form handling__: Simplified form management with ngx-lite-form
- __Development proxy__: Pre-configured proxy for API requests in development

## Tech Stack

- __Backend__: Express, Prisma, PostgreSQL, JSON Web Tokens
- __Frontend__: 
  - Angular 20.1.0 with Standalone Components
  - Angular Material (MDC) 20.1.3
  - ngx-lite-form 1.1.9 for form handling
  - RxJS 7.8.0 for reactive programming
  - TypeScript 5.8.0
  - SCSS for styling

## Project Structure

```
backend/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  src/
    index.ts
    controllers/
    routes/
    middleware/
    services/
    utils/
  package.json

frontend/
  src/
    app/
      components/
      interceptors/
      pages/
      services/
      routes.ts
      app.component.ts
      app.config.ts
    environments/
    styles.scss
    index.html
  package.json
```

## Prerequisites

- Node.js LTS (>=18)
- PostgreSQL (local or remote)

## Backend Setup (`backend/`)

1. Install dependencies

```bash
npm install
```

2. Copy environment file and configure

```bash
cp .env.example .env
```

On Windows:

```powershell
Copy-Item .env.example .env
```

```cmd
copy .env.example .env
```

Update `.env`:

- `DATABASE_URL` points to your PostgreSQL instance
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EMAIL_SECRET`, and `JWT_PASSWORD_RESET_SECRET` are strong random strings
- `CORS_ORIGIN` must match the frontend URL (default Angular dev server is `http://localhost:4200`)
- `SKIP_EMAIL_VERIFICATION` set to `true` for development or `false` for production

3. Initialize database

```bash
npm run prisma:generate
npm run prisma:migrate
# optional
npm run prisma:seed
```

4. Start the server

```bash
npm run dev
```

Backend runs on `http://localhost:4000` by default.

## Frontend Setup (`frontend/`)

1. Install dependencies

```bash
npm install
```

2. Environment Configuration

- `src/environments/environment.development.ts` - Development settings
- `src/environments/environment.ts` - Production settings

3. Proxy Configuration

A `proxy.conf.json` is included to route API requests to the backend during development:
```json
{
  "/api": {
    "target": "http://localhost:4000",
    "secure": false,
    "changeOrigin": true
  }
}
```

4. Start the development server

```bash
npm start
```

The frontend will be available at `http://localhost:4200` by default.

## Authentication Flow

- Login/Register set auth cookies via `withCredentials: true` requests
- Protected calls return 401 -> interceptor attempts `/auth/refresh`
- Logout clears cookies; `isAuthenticated$` updates in the `AuthService`

### Email Verification Flow

1. User registers → Email sent with verification link (if `SKIP_EMAIL_VERIFICATION=false`)
2. User clicks link → Account activated, can now login
3. Login blocked until email verified (if email verification required)

### Password Reset Flow

1. User clicks "Forgot password?" → Enters email on reset page
2. System sends password reset email with secure token link
3. User clicks link → Redirected to password reset form
4. User sets new password → All existing sessions invalidated
5. User can login with new password

## API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` – Register a new user
  - Body: `{ email: string, password: string, name?: string }`
  - Password requirements: 8+ chars, 1+ lowercase, 1+ uppercase, 1+ number
  - Returns: User profile and sets HTTP-only cookies
  - If `SKIP_EMAIL_VERIFICATION=false`, sends verification email and returns `requiresVerification: true`

- `POST /api/auth/login` – Authenticate user
  - Body: `{ email: string, password: string }`
  - Returns: User profile and sets HTTP-only cookies (if email verified)

- `POST /api/auth/logout` – Invalidate tokens
  - Requires authentication
  - Clears HTTP-only cookies

- `POST /api/auth/refresh` – Refresh access token
  - Uses refresh token from cookies
  - Returns new access token in cookies

- `GET /api/auth/profile` – Get current user profile
  - Requires authentication
  - Returns: `{ id: string, email: string, name?: string, emailVerified: boolean }`

- `GET /api/auth/verify-email` – Verify email address
  - Query param: `token` (JWT verification token)
  - Activates user account for login

- `POST /api/auth/resend-verification` – Resend verification email
  - Body: `{ email: string }`
  - Sends new verification email if account exists and isn't verified

- `POST /api/auth/forgot-password` – Request password reset
  - Body: `{ email: string }`
  - Sends password reset email (if account exists)

- `POST /api/auth/reset-password` – Reset password with token
  - Body: `{ token: string, password: string }`
  - Updates password and invalidates all existing sessions

### Health Check
- `GET /api/health` – Basic health check endpoint

> Note: All `/api/auth/*` endpoints have aliases under `/auth/*` for backward compatibility.
> All auth responses set HTTP-only cookies for token management.

## Useful Scripts

Backend (`backend/package.json`):

- `npm run dev` – start dev server with ts-node-dev
- `npm run build` / `npm start` – production build/run
- `npm run prisma:generate` – generate Prisma client
- `npm run prisma:migrate` – dev migration
- `npm run prisma:deploy` – deploy migrations in prod
- `npm run prisma:seed` – seed database
- `npm run prisma:studio` – open Prisma Studio

Frontend (`frontend/package.json`):

- `npm start` – Angular dev server
- `npm run build` – production build

## Troubleshooting

### CORS or Cookie Issues
- Ensure `CORS_ORIGIN` in backend `.env` matches your frontend origin
- Verify frontend requests include `withCredentials: true` (configured in `auth.service.ts`)
- Check browser console for CORS errors and verify the proxy is working

### Authentication
- Ensure cookies are being sent with requests (check browser dev tools)
- Verify token refresh is working by checking network requests
- Check backend logs for authentication errors

### Database
- Verify `DATABASE_URL` in `.env` is correct
- Run migrations with `npm run prisma:migrate`
- Use `prisma studio` to inspect the database if needed

### Development
- If making changes to the proxy config, restart the Angular dev server
- Clear browser cache if you encounter stale assets
- Check browser console for runtime errors

## Security Notes

- Use strong JWT secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EMAIL_SECRET`, `JWT_PASSWORD_RESET_SECRET`) and rotate them periodically.
- Set production cookie flags appropriately (e.g., `Secure`, `SameSite` per deployment topology).
- Rate limits are included for both general and auth-specific routes (see `.env.example`).
- Email verification prevents unauthorized account access.
- Password reset tokens expire quickly (1 hour) and invalidate all existing sessions upon use.
- Password reset responses don't reveal account existence for security.

## License

MIT