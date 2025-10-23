# Installation

Detailed installation instructions for StackInsight Auth Lite.

## Prerequisites

Before installing, ensure you have the following:

### Required
- **Docker** v20.10+ and **Docker Compose** v2.0+
- **Git** for cloning the repository
- **Node.js** v18+ (for local development without Docker)
- **PostgreSQL** v14+ (if not using Docker)

### Recommended
- **VS Code** with recommended extensions
- **Postman** or similar API testing tool
- A code editor with TypeScript support

## Installation Methods

### Option 1: Docker Compose (Recommended)

The easiest way to get started with all services running.

#### 1. Clone the Repository

```bash
git clone https://github.com/liangk/fullstack-auth-boilerplate.git
cd fullstack-auth-boilerplate
```

#### 2. Set Up Environment Variables

Create `.env` files for backend:

```bash
# Backend .env
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@db:5432/authdb"

# JWT Secrets (use strong, random strings)
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this

# Email Configuration (MailDev for development)
SMTP_HOST=maildev
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@stackinsight.app

# Application
NODE_ENV=development
PORT=4005
FRONTEND_URL=http://localhost:4205
```

#### 3. Start All Services

```bash
# From project root
docker-compose up -d
```

This will start:
- **PostgreSQL** on port 5432
- **Backend API** on port 4005
- **Frontend** on port 4205
- **MailDev** on port 1080 (email testing)

#### 4. Verify Installation

Check if all services are running:

```bash
docker-compose ps
```

You should see all services with status "Up".

Access the services:
- **Frontend**: http://localhost:4205
- **Backend API**: http://localhost:4005/api
- **MailDev**: http://localhost:1080

### Option 2: Local Development (Without Docker)

For development with hot-reloading and debugging.

#### 1. Clone and Install Dependencies

```bash
git clone https://github.com/liangk/fullstack-auth-boilerplate.git
cd fullstack-auth-boilerplate

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Set Up PostgreSQL Database

Install PostgreSQL locally and create a database:

```bash
psql -U postgres
CREATE DATABASE authdb;
\q
```

#### 3. Configure Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/authdb"
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_FROM=noreply@stackinsight.app
NODE_ENV=development
PORT=4005
FRONTEND_URL=http://localhost:4200
```

#### 4. Run Database Migrations

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

#### 5. Start Services Individually

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Terminal 3 - MailDev (Optional):**
```bash
npm install -g maildev
maildev
```

#### 6. Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:4005/api
- **MailDev**: http://localhost:1080

## Post-Installation Steps

### 1. Verify Backend Health

```bash
curl http://localhost:4005/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 2. Test User Registration

1. Open http://localhost:4205 (Docker) or http://localhost:4200 (Local)
2. Click "Sign Up"
3. Fill in the registration form
4. Check MailDev at http://localhost:1080 for verification email

### 3. Run Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

## Troubleshooting Installation

### Docker Issues

**Port Already in Use:**
```bash
# Check what's using the port
lsof -i :4205  # Frontend
lsof -i :4005  # Backend
lsof -i :5432  # PostgreSQL

# Kill the process or change ports in docker-compose.yml
```

**Services Won't Start:**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Issues

**Connection Refused:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

**Migration Errors:**
```bash
# Reset database (WARNING: deletes all data)
cd backend
npx prisma migrate reset
```

### Node Module Issues

**Missing Dependencies:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Version Conflicts:**
- Ensure Node.js version is 18+
- Clear npm cache: `npm cache clean --force`

## Next Steps

After successful installation:

1. Read the [Getting Started Guide](./getting-started.md) for a quick tour
2. Review [Architecture Overview](./architecture.md) to understand the structure
3. Check [Environment Configuration](./environment-configuration.md) for deployment settings
4. Explore [API Reference](./api-reference.md) to start building

## Uninstallation

### Docker

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (deletes database data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

### Local

```bash
# Drop database
psql -U postgres
DROP DATABASE authdb;
\q

# Remove node_modules
rm -rf backend/node_modules frontend/node_modules
```
