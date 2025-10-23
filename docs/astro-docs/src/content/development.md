# Development Guide

Local development workflow for StackInsight Auth Lite.

## Prerequisites
- Node.js 18+
- Docker + Docker Compose (recommended)
- PostgreSQL (if not using Docker)

## Start With Docker (Recommended)
```bash
docker-compose up -d
# Frontend: http://localhost:4205
# Backend: http://localhost:4005/api
# MailDev: http://localhost:1080
```

Check services:
```bash
docker-compose ps
docker-compose logs -f backend
```

## Start Without Docker
```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend
cd ../frontend
npm install
npm start

# Docs (Astro)
cd ../docs/astro-docs
npm install
npm run dev
```

## Useful Scripts
- Backend: `npm run dev`, `npm test`, `npm run lint`
- Frontend: `npm start`, `npm test`, `npm run lint`, `npm run build`
- Docs: `npm run dev`, `npm run build`, `npm run sync-docs`

## Database
```bash
cd backend
npx prisma migrate dev
npx prisma studio
```

## Environment Files
- Backend: `backend/.env`
- Frontend: `frontend/src/environments/environment.development.ts`
- Docs: none required for dev

## Debugging
- Use VS Code launch configs (Node attach, Angular Chrome)
- Inspect backend logs: `docker-compose logs -f backend`
- Network tab for cookies and CORS

## Code Style
- Prettier + ESLint configured
- Keep components small and typed

## Common Tasks
- Reset DB: `npx prisma migrate reset`
- Clear node_modules and reinstall if odd errors
- Clear browser cookies during auth testing
