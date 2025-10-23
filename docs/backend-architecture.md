# Backend Architecture

Overview of the Express.js backend for StackInsight Auth Lite.

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **ORM**: Prisma + PostgreSQL
- **Auth**: JWT (cookies), bcrypt
- **Validation**: zod
- **Email**: Nodemailer (SMTP)
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: pino (optional)

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Prisma migrations
├── src/
│   ├── app.ts                  # Express app setup
│   ├── server.ts               # HTTP server bootstrap
│   ├── config/                 # Env, constants
│   ├── middleware/             # Auth, CORS, helmet, rate-limiters
│   ├── modules/
│   │   ├── auth/               # Auth domain
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   ├── user/               # User domain
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.routes.ts
│   │   └── dashboard/          # Dashboard domain
│   │       ├── dashboard.controller.ts
│   │       ├── dashboard.service.ts
│   │       └── dashboard.routes.ts
│   ├── mail/                   # Email service + templates
│   └── utils/                  # Helpers (jwt, crypto, email, etc.)
├── .env                        # Environment variables
└── package.json
```

## App Initialization

```ts
// src/app.ts
const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health
app.get('/api/health', healthController);

// Error handler (last)
app.use(errorHandler);
export default app;
```

## Modules Pattern

Each domain (auth/user/dashboard) exposes:
- `*.routes.ts` – request mapping
- `*.controller.ts` – input/output + validation
- `*.service.ts` – business logic, prisma access

## Error Handling

- Central error handler formats errors consistently
- Controllers use zod to validate inputs
- Services throw typed errors consumed by handler

## Security Layers

- Helmet for headers
- CORS locked to `FRONTEND_URL`
- Rate limiting on `auth` and global `/api`
- Cookies: `HttpOnly`, `Secure`, `SameSite=strict` in prod

## Database Access

- Prisma Client singleton
- `schema.prisma` defines models and relations
- Migrations generated via `prisma migrate`

## Health & Observability

- `/api/health` returns status + db connectivity
- Logs via pino/pino-http
- Optional OpenTelemetry for traces

## Deployment Notes

- Ensure `trust proxy` when behind Railway/Load balancer
- Use `PORT` from env (default 4005)
- Enable DB SSL when provider requires it (`?sslmode=require`)
