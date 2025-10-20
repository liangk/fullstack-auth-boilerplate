# Troubleshooting Guide

Common issues and their solutions for the StackInsight Auth Lite.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Docker Issues](#docker-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [Email Issues](#email-issues)
- [CORS Issues](#cors-issues)
- [Frontend Issues](#frontend-issues)
- [Backend Issues](#backend-issues)
- [Deployment Issues](#deployment-issues)

---

## Installation Issues

### Node Modules Installation Fails

**Symptom**: `npm install` fails with errors

**Solutions**:

1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version**:
   ```bash
   node --version  # Should be 18+ for backend, 20+ for frontend
   ```

3. **Use correct package manager**:
   ```bash
   # This project uses npm, not yarn or pnpm
   npm install
   ```

4. **Permission issues (Linux/Mac)**:
   ```bash
   sudo chown -R $USER /usr/local/lib/node_modules
   ```

### TypeScript Compilation Errors

**Symptom**: `tsc` errors during build

**Solutions**:

1. **Install TypeScript**:
   ```bash
   npm install -D typescript
   ```

2. **Check `tsconfig.json`** is present

3. **Clear build cache**:
   ```bash
   rm -rf dist
   npm run build
   ```

---

## Docker Issues

### Containers Won't Start

**Symptom**: `docker-compose up` fails

**Solutions**:

1. **Check Docker is running**:
   ```bash
   docker --version
   docker ps
   ```

2. **Stop conflicting containers**:
   ```bash
   docker ps  # Check running containers
   docker stop <container-id>
   ```

3. **Remove old containers**:
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

4. **Check logs**:
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs postgres
   ```

### Port Already in Use

**Symptom**: "Port 4005 is already allocated"

**Solutions**:

1. **Find process using port**:
   ```bash
   # Linux/Mac
   lsof -i :4005
   
   # Windows
   netstat -ano | findstr :4005
   ```

2. **Kill process**:
   ```bash
   # Linux/Mac
   kill -9 <PID>
   
   # Windows
   taskkill /PID <PID> /F
   ```

3. **Change port in configuration**:
   - Update `backend/.env`: `PORT=4006`
   - Update `docker-compose.yml` ports
   - Update `frontend/proxy.conf.json`

### Database Container Exits Immediately

**Symptom**: PostgreSQL container stops after starting

**Solutions**:

1. **Check logs**:
   ```bash
   docker-compose logs postgres
   ```

2. **Remove volume and restart**:
   ```bash
   docker-compose down -v
   docker volume rm fullstack-auth-boilerplate_postgres_data
   docker-compose up
   ```

3. **Check disk space**:
   ```bash
   df -h
   ```

---

## Database Issues

### Connection Refused

**Symptom**: "ECONNREFUSED 127.0.0.1:5432"

**Solutions**:

1. **Check PostgreSQL is running**:
   ```bash
   # Docker
   docker ps | grep postgres
   
   # Native
   sudo systemctl status postgresql
   ```

2. **Verify DATABASE_URL**:
   ```bash
   # backend/.env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_boilerplate
   ```

3. **Check port mapping**:
   ```bash
   # docker-compose.yml should have:
   ports:
     - "5432:5432"
   ```

4. **Wait for container to be ready**:
   ```bash
   # Database needs ~5-10 seconds to initialize
   docker-compose logs postgres
   # Look for: "database system is ready to accept connections"
   ```

### Prisma Migration Fails

**Symptom**: "Migration failed" or "P1001: Can't reach database"

**Solutions**:

1. **Ensure database is running**:
   ```bash
   docker ps | grep postgres
   ```

2. **Check DATABASE_URL format**:
   ```
   postgresql://USER:PASS@HOST:PORT/DATABASE?schema=public
   ```

3. **Reset database** (development only):
   ```bash
   cd backend
   npm run db:reset
   ```

4. **Manual migration**:
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```

### Schema Drift Detected

**Symptom**: "Database schema is out of sync"

**Solutions**:

1. **Run migrations**:
   ```bash
   cd backend
   npm run prisma:migrate
   ```

2. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Reset database** (development only):
   ```bash
   npm run db:reset
   ```

---

## Authentication Issues

### "No token provided" Error

**Symptom**: Getting 401 errors on protected routes

**Solutions**:

1. **Check cookies are being sent**:
   - Open browser DevTools → Application/Storage → Cookies
   - Look for `access_token` and `refresh_token`

2. **Ensure credentials are included**:
   ```typescript
   // Frontend HTTP calls must include:
   { withCredentials: true }
   ```

3. **Check CORS configuration**:
   ```bash
   # backend/.env
   CORS_ORIGIN=http://localhost:4205
   ```

4. **Verify cookie domain matches**:
   - Both frontend and backend must be on same domain/subdomain
   - Or use proxy configuration

### Tokens Expire Too Quickly

**Symptom**: Being logged out frequently

**Solutions**:

1. **Adjust token expiration**:
   ```bash
   # backend/.env
   JWT_ACCESS_EXPIRES=30m  # Increase from 15m
   JWT_REFRESH_EXPIRES=30d  # Increase from 7d
   ```

2. **Implement automatic refresh** (already done in this project)

3. **Check system clock** is accurate

### Email Not Verified Error

**Symptom**: "Please verify your email before logging in"

**Solutions**:

1. **Check email in MailDev**:
   - Open http://localhost:1080
   - Click verification link

2. **Skip verification** (development only):
   ```bash
   # backend/.env
   SKIP_EMAIL_VERIFICATION=true
   ```

3. **Manually verify in database**:
   ```bash
   docker-compose exec postgres psql -U postgres -d auth_boilerplate
   UPDATE users SET "emailVerified" = true WHERE email = 'user@example.com';
   ```

### Invalid Credentials

**Symptom**: Login fails with "Invalid credentials"

**Solutions**:

1. **Check password** meets requirements:
   - Min 8 characters
   - 1 uppercase letter
   - 1 lowercase letter
   - 1 number

2. **Verify user exists**:
   ```bash
   docker-compose exec postgres psql -U postgres -d auth_boilerplate
   SELECT email, "emailVerified" FROM users;
   ```

3. **Try password reset flow**

---

## Email Issues

### Emails Not Sending

**Symptom**: No verification/reset emails received

**Solutions**:

1. **Check MailDev is running** (development):
   ```bash
   docker ps | grep maildev
   # Access: http://localhost:1080
   ```

2. **Verify SMTP configuration**:
   ```bash
   # backend/.env
   # Development (use MailDev):
   SMTP_HOST=
   
   # Production:
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Check backend logs**:
   ```bash
   docker-compose logs backend | grep -i smtp
   ```

4. **For Gmail, use App Password**:
   - Not your account password
   - Generate at: Google Account → Security → App Passwords

### Email Link Doesn't Work

**Symptom**: Clicking verification/reset link gives error

**Solutions**:

1. **Check token hasn't expired**:
   - Verification: 24 hours
   - Password reset: 1 hour

2. **Request new email**:
   - Verification: Use "Resend verification" button
   - Reset: Go through forgot password again

3. **Check frontend URL matches**:
   - Link should point to your frontend domain

---

## CORS Issues

### "CORS policy: No 'Access-Control-Allow-Origin' header"

**Symptom**: API calls blocked by browser

**Solutions**:

1. **Verify CORS_ORIGIN in backend**:
   ```bash
   # backend/.env
   CORS_ORIGIN=http://localhost:4205
   ```

2. **Check frontend URL matches exactly**:
   - Protocol (http/https)
   - Domain
   - Port

3. **For multiple origins**:
   ```bash
   CORS_ORIGIN=http://localhost:4205,https://yourapp.vercel.app
   ```

4. **Check credentials**:
   ```typescript
   // Backend (already configured)
   cors({ credentials: true, origin: ... })
   
   // Frontend (must include)
   { withCredentials: true }
   ```

### Cookies Not Being Set Cross-Origin

**Symptom**: Authentication works on same-origin, fails cross-origin

**Solutions**:

1. **Use Vercel proxy** (production):
   ```json
   // vercel.json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://backend.onrender.com/api/:path*"
       }
     ]
   }
   ```

2. **Update frontend to use relative URLs**:
   ```typescript
   // environment.ts (production)
   apiUrl: '/api'  // Not full URL
   ```

3. **Check SameSite cookie setting**:
   ```typescript
   // In production with proxy, use 'lax' or 'strict'
   sameSite: 'strict'
   ```

---

## Frontend Issues

### "Cannot find module" Errors

**Symptom**: Import errors in Angular

**Solutions**:

1. **Reinstall dependencies**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check import path**:
   ```typescript
   // Correct
   import { Component } from '@angular/core';
   
   // Wrong
   import { Component } from '@angular/Core';  // Capital C
   ```

3. **Clear Angular cache**:
   ```bash
   rm -rf .angular
   ng serve
   ```

### White Screen / Blank Page

**Symptom**: Application loads but shows nothing

**Solutions**:

1. **Check browser console** for errors:
   - F12 → Console tab

2. **Verify API is running**:
   - Open http://localhost:4005/api/health

3. **Check routing**:
   ```typescript
   // Make sure routes are configured
   export const routes: Routes = [ ... ];
   ```

4. **Check for build errors**:
   ```bash
   npm start
   # Look for compilation errors
   ```

### API Calls Fail with 404

**Symptom**: "GET http://localhost:4205/api/auth/profile 404"

**Solutions**:

1. **Check proxy configuration**:
   ```json
   // frontend/proxy.conf.json
   {
     "/api": {
       "target": "http://localhost:4005",
       "secure": false,
       "changeOrigin": true
     }
   }
   ```

2. **Ensure proxy is active**:
   ```json
   // frontend/package.json
   "start": "ng serve --proxy-config proxy.conf.json"
   ```

3. **Check backend URL**:
   ```typescript
   // frontend/src/environments/environment.development.ts
   apiUrl: 'http://localhost:4005/api'
   ```

---

## Backend Issues

### "Cannot find module 'dotenv'"

**Symptom**: Backend crashes on startup

**Solutions**:

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Check dotenv is imported**:
   ```typescript
   // First line of index.ts
   import 'dotenv/config';
   ```

### "JWT secret not defined"

**Symptom**: Application crashes immediately

**Solutions**:

1. **Create .env file**:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Generate secrets**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Add to .env**:
   ```bash
   JWT_ACCESS_SECRET=generated_secret_here
   JWT_REFRESH_SECRET=different_secret_here
   JWT_EMAIL_SECRET=email_secret_here
   JWT_PASSWORD_RESET_SECRET=reset_secret_here
   ```

### Rate Limit Exceeded During Development

**Symptom**: "Too many requests" error while testing

**Solutions**:

1. **Increase rate limits** (development):
   ```bash
   # backend/.env
   RATE_LIMIT_MAX=1000
   AUTH_RATE_LIMIT_MAX=50
   ```

2. **Clear rate limit** (restart backend):
   ```bash
   docker-compose restart backend
   ```

3. **Use different IPs** or clear cookies

---

## Deployment Issues

### Vercel Build Fails

**Symptom**: Frontend deployment fails

**Solutions**:

1. **Check build locally**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Verify Node version**:
   - Vercel uses Node 18 by default
   - Check `package.json` engines field

3. **Check environment variables**:
   - Set in Vercel dashboard
   - Environment Variables section

### Render Backend Won't Start

**Symptom**: Backend deployment crashes

**Solutions**:

1. **Check logs** in Render dashboard

2. **Verify environment variables** are set:
   - All JWT secrets
   - DATABASE_URL
   - CORS_ORIGIN

3. **Check Dockerfile**:
   - Ensure EXPOSE matches PORT
   - Check start command

### Database Connection Fails in Production

**Symptom**: Backend can't connect to Neon/production DB

**Solutions**:

1. **Check CONNECTION_URL format**:
   ```
   postgresql://user:pass@host.neon.tech/db?sslmode=require
   ```

2. **Verify SSL mode**:
   - Neon requires: `?sslmode=require`

3. **Check IP whitelist**:
   - Some providers require whitelisting
   - Render IPs may need to be allowed

4. **Test connection locally**:
   ```bash
   # Copy production DATABASE_URL
   npx prisma db pull --schema=./prisma/schema.prisma
   ```

---

## General Debugging Tips

### Enable Debug Logging

**Backend**:
```typescript
// Add to backend/src/index.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend**:
```typescript
// Add to service calls
.pipe(
  tap(data => console.log('Response:', data)),
  catchError(err => {
    console.error('Error:', err);
    return throwError(() => err);
  })
)
```

### Check Browser DevTools

1. **Network Tab**: See API requests/responses
2. **Console Tab**: JavaScript errors
3. **Application Tab**: Cookies, localStorage
4. **Sources Tab**: Breakpoints for debugging

### Docker Debugging

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f backend

# Enter container
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres

# Check container status
docker-compose ps

# Restart specific service
docker-compose restart backend
```

### Database Inspection

```bash
# Using Docker
docker-compose exec postgres psql -U postgres -d auth_boilerplate

# Using Prisma Studio
cd backend
npm run prisma:studio
# Opens at http://localhost:5555
```

**Useful SQL Queries**:
```sql
-- List all users
SELECT id, email, "emailVerified", "createdAt" FROM users;

-- Manually verify user
UPDATE users SET "emailVerified" = true WHERE email = 'user@example.com';

-- Delete user
DELETE FROM users WHERE email = 'user@example.com';

-- Count users
SELECT COUNT(*) FROM users;
```

---

## Getting More Help

If you can't find a solution here:

1. **Check logs** for specific error messages
2. **Search existing** [GitHub Issues](https://github.com/liangk/fullstack-auth-boilerplate/issues)
3. **Open a new issue** with:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version, Docker version)
   - Relevant logs
4. **Ask in** [Discussions](https://github.com/liangk/fullstack-auth-boilerplate/discussions)

---

## Related Documentation

- [Getting Started](./getting-started.md) - Initial setup
- [Environment Configuration](./environment-configuration.md) - Configuration guide
- [API Reference](./api-reference.md) - API documentation
- [FAQ](./faq.md) - Frequently asked questions
