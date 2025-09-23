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

## End-to-End Setup Guides

### Option A: Docker (Recommended)

This spins up PostgreSQL, MailDev, Backend, and Frontend.

1. Start all services (build + run in background)
   ```bash
   docker-compose up -d --build
   ```

2. Create/update the database schema
   ```bash
   docker-compose exec backend npx prisma db push
   # (optional) seed sample data
   docker-compose exec backend npm run prisma:seed
   ```

3. Open the app
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - MailDev (Email testing): http://localhost:1080
   - PostgreSQL: localhost:5432

4. Test the flow
   - Register a user in the UI
   - Open MailDev (http://localhost:1080), open the verification email, click the link

Notes
- SMTP is pre-wired for Docker via `SMTP_HOST=maildev` and `SMTP_PORT=1025` in `docker-compose.yml`.
- If you re-install dependencies in containers, re-run `npx prisma db push`.

### Option B: Manual (Local without Docker)

1. PostgreSQL
   - Option 1 (Dockerized Postgres only):
     ```bash
     docker run --name local-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
     ```
     Create the database once connected (psql or GUI):
     ```sql
     CREATE DATABASE auth_boilerplate;
     ```
   - Option 2 (Native Postgres): ensure a database named `auth_boilerplate` exists and you have a connection string.

2. MailDev (Email testing)
   ```bash
   npx maildev -s 1025 -w 1080
   # UI: http://localhost:1080, SMTP: localhost:1025
   ```

3. Backend (`backend/`)
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   Update `.env`:
   - `DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_boilerplate?schema=public`
   - `CORS_ORIGIN=http://localhost:4200`
   - `SMTP_HOST=localhost` and `SMTP_PORT=1025` (for MailDev)
   - Set strong values for all JWT secrets
   
   Initialize DB and start the API:
   ```bash
   npx prisma db push
   # optional: npm run prisma:seed
   npm run dev
   # API at http://localhost:4000
   ```

4. Frontend (`frontend/`)
   ```bash
   cd frontend
   npm install
   npm start
   # App at http://localhost:4200
   ```

5. Test the flow
   - Register in the UI → open MailDev (http://localhost:1080) → click verification link

Tips
- If you see a runtime error related to `LiteDateTime` from `ngx-lite-form`, pin the dependency to `"ngx-lite-form": "1.1.9"` in `frontend/package.json`.
- Ensure the frontend dev server uses the included proxy (`proxy.conf.json`) so API calls go to `http://localhost:4000` with cookies.

## Verify Setup Checklist

- [ ] **Backend health**: `curl http://localhost:4000/api/health` → `{"status":"ok"}`
- [ ] **Database online**: `docker-compose exec postgres pg_isready` (Docker) or connect via psql.
- [ ] **Prisma schema applied**: `docker-compose exec backend npx prisma migrate status` shows database is up-to-date.
- [ ] **Frontend reachable**: Open `http://localhost:3000` (Docker) or `http://localhost:4200` (manual) and see the landing page.
- [ ] **Email flow**: Register a new user → open MailDev `http://localhost:1080`, open verification email, click link → login succeeds.
- [ ] **JWT cookies**: Inspect browser dev tools – `access_token` & `refresh_token` cookies are set after login.

## Architecture Overview

```text
+-----------+      HTTP       +-----------+      HTTP      +-----------+
|  Browser  | <-------------> | Frontend  | <------------> |  Backend  |
| (Angular) |                 |  Nginx    |                |  Express  |
+-----------+                 +-----------+                +-----------+
                                                            |
                                                            |  SQL
                                                            v
                                                      +-----------+
                                                      | Postgres  |
                                                      +-----------+
                                                            ^
                                                            | SMTP
                                                            v
                                                      +-----------+
                                                      | MailDev   |
                                                      +-----------+
```

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

## Docker Setup (Recommended for Development)

This project includes a complete Docker Compose setup with PostgreSQL, MailDev, backend, and frontend services.

### Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

### Quick Start with Docker

1. **Clone the repository** (if not already done)

2. **Start all services:**
```bash
docker-compose up --build
```
Or use the helper script:
```bash
./docker-dev.sh start
```

3. **Access the application:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:4000
   - **MailDev (Email Testing):** http://localhost:1080
   - **PostgreSQL:** localhost:5432

### Docker Services

- **PostgreSQL**: Database server with persistent data volume
- **MailDev**: Email testing server (captures all emails sent by the app)
- **Backend**: Node.js/Express API server with hot reload
- **Frontend**: Angular SPA served by Nginx with API proxy

### Useful Docker Commands

```bash
# Quick commands using helper script
./docker-dev.sh start      # Start all services
./docker-dev.sh start-bg   # Start in background
./docker-dev.sh stop       # Stop all services
./docker-dev.sh restart    # Restart all services
./docker-dev.sh logs       # View logs
./docker-dev.sh migrate    # Run migrations
./docker-dev.sh seed       # Seed database
./docker-dev.sh studio     # Open Prisma Studio
./docker-dev.sh clean      # Clean up everything

# Or use docker-compose directly
# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build --force-recreate

# Clean up (removes volumes too)
docker-compose down -v

# Run database migrations in container
docker-compose exec backend npm run prisma:migrate

# Access database directly
docker-compose exec postgres psql -U postgres -d auth_boilerplate

# View MailDev emails
open http://localhost:1080
```

### Environment Configuration

The Docker setup includes pre-configured environment variables for development:

- **Database:** `postgresql://postgres:password@postgres:5432/auth_boilerplate`
- **JWT Secrets:** Development secrets (replace in production)
- **Email:** Uses MailDev instead of real SMTP
- **CORS:** Configured for `http://localhost:3000`

### Development Workflow with Docker

1. **Make code changes** - Files are volume-mounted, so changes are reflected immediately
2. **Backend hot reload** - Uses `ts-node-dev` for automatic restarts
3. **Frontend hot reload** - Angular dev server with proxy to backend
4. **Database persistence** - Data survives container restarts

### Production Deployment

For production, create a `docker-compose.prod.yml` with:
- Environment-specific secrets
- Production database URL
- Real SMTP configuration
- SSL/TLS certificates

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

## CI/CD Pipeline

### Backend CI/CD

The backend includes a comprehensive CI/CD pipeline using GitHub Actions that runs on every push and pull request to `main` and `develop` branches.

**What it does:**
- ✅ **Code Quality**: ESLint for TypeScript linting
- ✅ **Code Formatting**: Prettier for consistent code style
- ✅ **Testing**: Jest for unit testing with coverage reports
- ✅ **Database**: Prisma client generation
- ✅ **Coverage Reports**: Upload coverage to Codecov

**Setup Requirements:**

1. **Install Dependencies** (one-time setup):
```bash
cd backend
npm install
```

2. **Add Repository Secrets** (in GitHub Settings → Secrets and variables → Actions):
   - `TEST_DATABASE_URL`: PostgreSQL connection string for test database

3. **Local Development Commands**:
```bash
# Linting
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors

# Code formatting
npm run format        # Format code with Prettier
npm run format:check  # Check if code is formatted

# Testing
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

**Workflow File**: `.github/workflows/backend-ci.yml`

The pipeline will automatically:
- Run on pushes to `main`/`develop` branches
- Run on pull requests targeting `main`/`develop` branches
- Only trigger when backend files are changed (`backend/**`)

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