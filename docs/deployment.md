# Deployment Overview

Strategies to deploy StackInsight Auth Lite to production.

## Recommended Topologies

- **Separate Frontend + Backend** (recommended)
  - Frontend: Static hosting (Railway, Vercel, Netlify) via nginx or platform CDN
  - Backend: Node/Express on Railway/Render/Fly.io
  - Database: Managed Postgres (Railway, Supabase, Neon, RDS)

- **Docker Compose (single host)**
  - All services on a VM; production hardening required (TLS, backups, monitoring)

## Prerequisites

- Production `.env` for backend (see `deploy-environment.md`)
- `environment.ts` points to production API origin over HTTPS
- CORS configured to allow your frontend origin
- SMTP configured with verified sender

## Backend Deployment (Railway)

1. Create a new service from the backend folder
2. Set variables: `DATABASE_URL`, `JWT_*`, `FRONTEND_URL`, `SMTP_*`, `NODE_ENV=production`
3. Set `PORT=4005` and expose it
4. Add a managed Postgres service and connect with SSL
5. Run migrations: `npx prisma migrate deploy`

## Frontend Deployment (Railway)

1. Build Angular app in CI or Railway build
2. Serve with nginx (Dockerfile already provided)
3. Ensure nginx does not proxy `/api` (frontend talks directly to `environment.apiUrl`)
4. Set `environment.ts` `apiUrl` to backend URL (HTTPS)

## Vercel Deployment (Frontend)

- Use `vercel.json` rewrites if you want Vercel to proxy to your backend
- Otherwise set `environment.apiUrl` directly to backend origin
- Build command: `npm run build`
- Output: `dist/frontend`

## Domains & TLS

- Use HTTPS for both frontend and backend
- Configure custom domains and automatic TLS via platform

## Health & Monitoring

- Expose `/api/health` on backend
- Set up log drains and alerts (error rate, restarts)

## Backups

- Enable automated Postgres backups
- Test restore procedure

## Post-Deploy Checklist

- [ ] HTTPS enabled on both services
- [ ] CORS allows only production frontend
- [ ] Cookies are `Secure`, `HttpOnly`, `SameSite=strict`
- [ ] SMTP verified and emails delivered
- [ ] Admin user created (seed)
- [ ] Error monitoring active
- [ ] Rate limiting enabled
