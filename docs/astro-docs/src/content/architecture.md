# Architecture Overview

This document provides a comprehensive overview of the StackInsight Auth Lite architecture.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                     Angular 20 (SPA)                         │
│                  http://localhost:4205                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │   Services   │     │
│  │              │  │              │  │              │     │
│  │ - Login      │  │ - Navbar     │  │ - Auth       │     │
│  │ - Register   │  │ - Snackbar   │  │ - Dashboard  │     │
│  │ - Dashboard  │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Guards     │  │ Interceptors │  │    Models    │     │
│  │              │  │              │  │              │     │
│  │ - AuthGuard  │  │ - HTTP       │  │ - User       │     │
│  │              │  │              │  │ - Dashboard  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            │ (with credentials)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                Express.js + TypeScript                       │
│                  http://localhost:4005                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │ Controllers  │  │   Services   │     │
│  │              │  │              │  │              │     │
│  │ - Auth       │  │ - Auth       │  │ - Auth       │     │
│  │ - Dashboard  │  │ - Dashboard  │  │ - Email      │     │
│  │ - Health     │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Middleware  │  │     Utils    │  │    Prisma    │     │
│  │              │  │              │  │   ORM Layer  │     │
│  │ - Auth       │  │ - JWT        │  │              │     │
│  │ - RateLimit  │  │ - Constants  │  │              │     │
│  │ - Validator  │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
│                    PostgreSQL 15                             │
│                  localhost:5432                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   User Table                          │  │
│  │                                                       │  │
│  │  - id (UUID, PK)                                      │  │
│  │  - email (VARCHAR, UNIQUE)                            │  │
│  │  - password (VARCHAR, hashed)                         │  │
│  │  - name (VARCHAR, nullable)                           │  │
│  │  - emailVerified (BOOLEAN)                            │  │
│  │  - tokenVersion (INTEGER)                             │  │
│  │  - createdAt (TIMESTAMP)                              │  │
│  │  - updatedAt (TIMESTAMP)                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     EMAIL SERVICE                            │
│                   MailDev (Development)                      │
│                    localhost:1080                            │
│                                                              │
│            SMTP Server: localhost:1025                       │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

### Frontend Structure (`/frontend`)

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── navbar.component.ts
│   │   │   └── snackbar.service.ts
│   │   │
│   │   ├── guards/              # Route protection
│   │   │   └── auth.guard.ts
│   │   │
│   │   ├── models/              # TypeScript interfaces
│   │   │   ├── auth.ts
│   │   │   └── dashboard.ts
│   │   │
│   │   ├── pages/               # Page components
│   │   │   ├── login.page.ts
│   │   │   ├── register.page.ts
│   │   │   ├── dashboard.page.ts
│   │   │   ├── profile.page.ts
│   │   │   ├── forgot-password.page.ts
│   │   │   ├── reset-password.page.ts
│   │   │   ├── verify-email.page.ts
│   │   │   ├── pages.scss       # Shared page styles
│   │   │   └── not-found.page.ts
│   │   │
│   │   ├── services/            # Business logic
│   │   │   ├── auth.service.ts
│   │   │   └── dashboard.service.ts
│   │   │
│   │   ├── material.module.ts   # Material Design imports
│   │   ├── routes.ts            # Route configuration
│   │   └── app.component.ts     # Root component
│   │
│   ├── environments/            # Environment configs
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   │
│   ├── index.html               # HTML entry point
│   ├── main.ts                  # Application bootstrap
│   └── styles.scss              # Global styles
│
├── angular.json                 # Angular configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── proxy.conf.json              # Dev proxy config
└── Dockerfile                   # Production build
```

### Backend Structure (`/backend`)

```
backend/
├── src/
│   ├── controllers/             # Request handlers
│   │   ├── authController.ts
│   │   └── dashboardController.ts
│   │
│   ├── middleware/              # Custom middleware
│   │   ├── requireAuth.ts       # Auth validation
│   │   ├── validateRequest.ts   # Input validation
│   │   ├── rateLimiter.ts       # Rate limiting
│   │   ├── authRateLimiter.ts   # Auth-specific limits
│   │   ├── errorHandler.ts      # Error handling
│   │   └── logger.ts            # Request logging
│   │
│   ├── routes/                  # Route definitions
│   │   ├── authRoutes.ts
│   │   ├── dashboardRoutes.ts
│   │   └── health.ts
│   │
│   ├── services/                # Business logic
│   │   ├── authService.ts       # User management
│   │   └── mailService.ts       # Email sending
│   │
│   ├── utils/                   # Utility functions
│   │   ├── jwt.ts               # JWT utilities
│   │   └── constants.ts         # App constants
│   │
│   ├── prisma.ts                # Prisma client
│   └── index.ts                 # App entry point
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # DB migrations
│   └── seed.ts                  # Seed data
│
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── .env.example                 # Environment template
├── Dockerfile                   # Production build
└── jest.config.js               # Test configuration
```

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 20.x | Frontend framework |
| **TypeScript** | 5.8.x | Type-safe JavaScript |
| **Angular Material** | 20.x | UI component library |
| **RxJS** | 7.8.x | Reactive programming |
| **SCSS** | - | Styling |
| **ngx-lite-form** | 1.3.x | Form handling |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **Express.js** | 4.x | Web framework |
| **TypeScript** | 5.5.x | Type-safe JavaScript |
| **Prisma** | 5.22.x | ORM and migrations |
| **PostgreSQL** | 15 | Database |
| **JWT** | 9.x | Authentication tokens |
| **Bcrypt** | 5.x | Password hashing |
| **Nodemailer** | 7.x | Email service |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Jest** | Testing framework |
| **MailDev** | Email testing |

## Data Flow

### Authentication Flow

```
1. User Registration
   ┌──────────┐      POST /auth/register       ┌──────────┐
   │ Frontend │ ──────────────────────────────> │ Backend  │
   └──────────┘                                 └──────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Validate     │
                                              │ Input        │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Hash         │
                                              │ Password     │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Create User  │
                                              │ in DB        │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Generate     │
                                              │ Email Token  │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Send         │
                                              │ Email        │
                                              └──────────────┘

2. Email Verification
   User clicks link in email
   │
   ▼
   GET /auth/verify-email?token=xxx
   │
   ▼
   Verify JWT token
   │
   ▼
   Update user.emailVerified = true

3. User Login
   ┌──────────┐      POST /auth/login          ┌──────────┐
   │ Frontend │ ──────────────────────────────> │ Backend  │
   └──────────┘                                 └──────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Verify       │
                                              │ Credentials  │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Check Email  │
                                              │ Verified     │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Generate     │
                                              │ Access Token │
                                              │ (15 min)     │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Generate     │
                                              │ Refresh Token│
                                              │ (7 days)     │
                                              └──────────────┘
                                                      │
                                                      ▼
   ┌──────────┐   Set HttpOnly Cookies        ┌──────────┐
   │ Frontend │ <────────────────────────────  │ Backend  │
   └──────────┘   + User Profile Data         └──────────┘

4. Protected Request
   ┌──────────┐      GET /dashboard/stats      ┌──────────┐
   │ Frontend │ ──────────────────────────────> │ Backend  │
   └──────────┘   (cookies sent automatically)  └──────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Extract      │
                                              │ Access Token │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Verify JWT   │
                                              │ Signature    │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Check Token  │
                                              │ Expiry       │
                                              └──────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │ Process      │
                                              │ Request      │
                                              └──────────────┘
```

## Security Architecture

### Token-Based Authentication

**Access Token (Short-lived)**
- **Expiry**: 15 minutes
- **Purpose**: API authentication
- **Storage**: HTTP-only cookie
- **Payload**: User ID, token version

**Refresh Token (Long-lived)**
- **Expiry**: 7 days
- **Purpose**: Generate new access tokens
- **Storage**: HTTP-only cookie
- **Payload**: User ID, token version

**Token Version**
- Stored in user record
- Incremented on security events (password change, logout all)
- Invalidates all existing tokens

### Cookie Security

```javascript
{
  httpOnly: true,        // Not accessible via JavaScript
  secure: true,          // HTTPS only (production)
  sameSite: 'strict',    // CSRF protection
  maxAge: 900000,        // 15 minutes (access token)
  path: '/'              // Available to all routes
}
```

### Password Security

1. **Hashing**: Bcrypt with 10 salt rounds
2. **Validation**: Min 8 chars, uppercase, lowercase, number
3. **Storage**: Only hashed passwords stored
4. **Reset**: Time-limited JWT tokens

### API Security Layers

```
Request
  │
  ├─> CORS Check (origin validation)
  │
  ├─> Rate Limiting (IP-based)
  │
  ├─> Helmet Headers (XSS, etc.)
  │
  ├─> Input Validation (express-validator)
  │
  ├─> Authentication (JWT verification)
  │
  └─> Route Handler
```

## Database Design

### User Model

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  name          String?
  emailVerified Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  tokenVersion  Int      @default(0)

  @@index([email])
}
```

**Design Decisions**:
- **UUID**: Better security than auto-increment IDs
- **Email Index**: Fast lookups
- **Token Version**: Session invalidation support
- **Timestamps**: Audit trail
- **Nullable Name**: Optional field

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────┐
│                   VERCEL CDN                         │
│            (Frontend Static Files)                   │
│           fullstack-auth.vercel.app                  │
└─────────────────────────────────────────────────────┘
                      │
                      │ API Proxy: /api/* → Backend
                      ▼
┌─────────────────────────────────────────────────────┐
│                  RENDER.COM                          │
│              (Backend Container)                     │
│         your-backend.onrender.com                    │
└─────────────────────────────────────────────────────┘
                      │
                      │ PostgreSQL Connection
                      ▼
┌─────────────────────────────────────────────────────┐
│                   NEON.TECH                          │
│           (Serverless PostgreSQL)                    │
└─────────────────────────────────────────────────────┘
```

### Vercel Proxy Configuration

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.onrender.com/api/:path*"
    }
  ]
}
```

This solves cross-origin cookie issues by making frontend and backend appear on the same domain.

## Scalability Considerations

### Horizontal Scaling

The application is designed to scale horizontally:

1. **Stateless Backend**: No session storage on server
2. **Database Pooling**: Connection reuse
3. **CDN Frontend**: Global distribution
4. **Token-Based Auth**: No server-side sessions

### Performance Optimizations

1. **Database Indexes**: Fast user lookups
2. **Connection Pooling**: Prisma manages connections
3. **Lazy Loading**: Frontend code splitting
4. **Caching Headers**: Browser caching
5. **Compression**: Gzip/Brotli enabled

## Monitoring & Logging

### Backend Logging

- Request logging (Morgan)
- Error logging (console.error)
- Custom event logging

### Frontend Error Handling

- HTTP interceptors
- Global error handlers
- User-friendly error messages

## Development Workflow

```
Developer Machine
  │
  ├─> Write Code
  │
  ├─> Test Locally (Docker)
  │
  ├─> Commit to Git
  │
  ▼
GitHub Repository
  │
  ├─> GitHub Actions CI
  │   ├─> Lint
  │   ├─> Test
  │   └─> Build
  │
  ▼
Deployment
  ├─> Vercel (Frontend)
  └─> Render (Backend)
```

## Next Steps

- [Development Guide](./development.md) - Local development workflow
- [API Reference](./api-reference.md) - Complete API documentation
- [Security](./security.md) - Security best practices
- [Deployment](./deployment.md) - Production deployment guide
