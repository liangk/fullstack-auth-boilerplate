# Fullstack Auth Boilerplate

Modern fullstack authentication boilerplate featuring:

- Backend: Node.js, Express, Prisma (PostgreSQL), JWT access/refresh tokens, secure cookies, CORS, Helmet, rate limiting, validation
- Frontend: Angular (standalone components), Angular Material, responsive UI, form validation, global loading bar, snackbars

This project gives you a clean starting point to build authenticated web apps quickly.

## Features

- __JWT auth with refresh tokens__ using HTTP-only cookies
- __Prisma ORM__ with PostgreSQL and a simple `User` model
- __Security hardening__: Helmet, CORS, rate limiting, auth-only refresh, input validation
- __Angular Material UI__: theming, toolbar, cards, form fields, snackbars, progress indicators
- __Great UX__: real-time form validation, password visibility toggle, global loading indicator

## Tech Stack

- __Backend__: Express, Prisma, PostgreSQL, JSON Web Tokens
- __Frontend__: Angular 17+, Angular Material (MDC), Standalone Components, RxJS

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
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are strong random strings
- `CORS_ORIGIN` must match the frontend URL (default Angular dev server is `http://localhost:4200`)

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

2. Verify environment config

Make sure `src/environments/environment.development.ts` has `apiUrl` pointing to the backend (e.g. `http://localhost:4000`).

3. Start the dev server

```bash
npm start
```

Frontend runs on Angular dev server (default `http://localhost:4200`). If you change the port, update backend `CORS_ORIGIN` to match.

## Authentication Flow

- Login/Register set auth cookies via `withCredentials: true` requests
- Protected calls return 401 -> interceptor attempts `/auth/refresh`
- Logout clears cookies; `isAuthenticated$` updates in the `AuthService`

## API Endpoints (Backend)

- `GET  /api/health` – health check
- `POST /api/auth/register` – create a user, set tokens
- `POST /api/auth/login` – authenticate, set tokens
- `POST /api/auth/logout` – clear tokens
- `POST /api/auth/refresh` – rotate/refresh access token
- `GET  /api/auth/profile` – current user profile

Note: Non-prefixed aliases also exist under `/auth/*` for convenience.

All auth routes use cookies; ensure frontend requests set `withCredentials: true` (already configured).

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

- __CORS or cookie issues__: Ensure `CORS_ORIGIN` matches the exact frontend origin. Use the same protocol/host/port. Frontend requests must use `withCredentials` (already enabled).
- __Port mismatch__: Backend uses `4000`. Angular default is `4200`. If you change frontend port, update backend `CORS_ORIGIN`.
- __Database errors__: Verify `DATABASE_URL` and that migrations ran successfully.

## Security Notes

- Use strong JWT secrets and rotate them periodically.
- Set production cookie flags appropriately (e.g., `Secure`, `SameSite` per deployment topology).
- Rate limits are included for both general and auth-specific routes (see `.env.example`).

## License

MIT