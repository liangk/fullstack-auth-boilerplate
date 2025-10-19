# Getting Started

This guide will help you get the Fullstack Auth Boilerplate up and running on your local machine in just a few minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Node.js** (v18+ for local development without Docker)
- **Git** for cloning the repository
- A code editor (VS Code recommended)

## Quick Start with Docker (Recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/liangk/fullstack-auth-boilerplate.git
cd fullstack-auth-boilerplate
```

### 2. Start All Services

```bash
./docker-dev.sh start
```

This single command will:
- Build Docker images for frontend and backend
- Start PostgreSQL database
- Start MailDev email testing server
- Run database migrations
- Start frontend and backend with hot-reloading

### 3. Access the Application

Once all services are running, access:

- **Frontend**: [http://localhost:4205](http://localhost:4205)
- **Backend API**: [http://localhost:4005](http://localhost:4005)
- **MailDev (Email Viewer)**: [http://localhost:1080](http://localhost:1080)
- **Database**: `localhost:5432`

### 4. Test the Application

1. **Register a new account** at [http://localhost:4205/register](http://localhost:4205/register)
2. **Check your email** in MailDev at [http://localhost:1080](http://localhost:1080)
3. **Verify your account** by clicking the link in the email
4. **Log in** at [http://localhost:4205/login](http://localhost:4205/login)
5. **View the dashboard** at [http://localhost:4205/dashboard](http://localhost:4205/dashboard)

## Docker Helper Commands

The `docker-dev.sh` script provides convenient commands:

```bash
# Start all services (foreground)
./docker-dev.sh start

# Start all services (background/detached)
./docker-dev.sh start-bg

# Stop all services
./docker-dev.sh stop

# Restart all services
./docker-dev.sh restart

# View logs
./docker-dev.sh logs

# Run database migrations
./docker-dev.sh migrate

# Seed the database
./docker-dev.sh seed

# Open Prisma Studio
./docker-dev.sh studio

# Open backend shell
./docker-dev.sh shell

# Open PostgreSQL shell
./docker-dev.sh db-shell

# Clean up everything (destructive)
./docker-dev.sh clean
```

## Manual Setup (Without Docker)

If you prefer not to use Docker:

### 1. Setup PostgreSQL

Install PostgreSQL and create a database:

```sql
CREATE DATABASE auth_boilerplate;
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database connection
# DATABASE_URL=postgresql://username:password@localhost:5432/auth_boilerplate

# Run migrations
npm run prisma:migrate

# Start backend
npm run dev
```

Backend will run on [http://localhost:4005](http://localhost:4005)

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will run on [http://localhost:4205](http://localhost:4205)

### 4. Setup MailDev (Optional)

For local email testing:

```bash
npm install -g maildev
maildev
```

Access MailDev at [http://localhost:1080](http://localhost:1080)

## Default Configuration

The project comes with sensible defaults:

- **Frontend Port**: 4205
- **Backend Port**: 4005
- **Database Port**: 5432
- **MailDev Web**: 1080
- **MailDev SMTP**: 1025

## Verification Checklist

✅ Services are running  
✅ Frontend accessible at localhost:4205  
✅ Backend responding at localhost:4005  
✅ Can register a new user  
✅ Verification email received in MailDev  
✅ Can verify email and log in  
✅ Dashboard displays user information  
✅ Can log out  

## Next Steps

Now that you have the application running:

1. **Explore the Features**: [Features Guide](./features.md)
2. **Understand the Architecture**: [Architecture Overview](./architecture.md)
3. **Review the API**: [API Reference](./api-reference.md)
4. **Customize for Your Needs**: [Development Guide](./development.md)

## Troubleshooting

Having issues? Check the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

### Common Issues

**Port already in use:**
```bash
# Check what's using the port
lsof -i :4205  # or :4005

# Kill the process or change port in configuration
```

**Docker containers not starting:**
```bash
# View logs
docker-compose logs

# Restart Docker daemon
# Then try again: ./docker-dev.sh start
```

**Database connection issues:**
```bash
# Ensure PostgreSQL is running
docker ps

# Check DATABASE_URL in backend/.env
```

## Getting Help

- 📖 Read the [FAQ](./faq.md)
- 🐛 Check [GitHub Issues](https://github.com/liangk/fullstack-auth-boilerplate/issues)
- 💬 Join [Discussions](https://github.com/liangk/fullstack-auth-boilerplate/discussions)
