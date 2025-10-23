# Docker Guide

Run StackInsight Auth Lite with Docker and Docker Compose.

## Services

- `db`: PostgreSQL database
- `backend`: Express API
- `frontend`: Angular app served by nginx
- `maildev`: Email testing UI

## Start All Services

```bash
docker-compose up -d
```

Check status:
```bash
docker-compose ps
```

Logs:
```bash
docker-compose logs -f backend
```

## Networking

- Backend reachable at `http://backend:4005` inside the Docker network
- Frontend reachable at `http://frontend:80` inside the network
- From host:
  - Frontend: `http://localhost:4205`
  - Backend: `http://localhost:4005`
  - DB: `localhost:5432`
  - MailDev: `http://localhost:1080`

## Environment Variables

- `backend/.env` must be present; see `docs/deploy-environment.md`
- Compose file maps env and ports

## Rebuild

```bash
docker-compose build --no-cache
```

## Common Issues

- **Port in use**: stop service using the port or change port mapping
- **DB migration errors**: reset with `npx prisma migrate reset` (dev only)
- **CORS errors**: ensure `FRONTEND_URL` and CORS origin match
- **Cookies missing**: use `withCredentials: true` on frontend and HTTPS in prod

## Production Notes

- For Railway, build frontend and backend separately
- Frontend nginx should not proxy `/api` in separated deploys
- Use managed Postgres with SSL (`?sslmode=require`)
