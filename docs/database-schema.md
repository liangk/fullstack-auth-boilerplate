# Database Schema

Prisma schema and data model for StackInsight Auth Lite.

## Overview

- PostgreSQL as the primary database
- Prisma ORM with migrations
- Core models: `User`, `RefreshToken`, `ActivityLog`

## Prisma Models (Example)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  password     String
  name         String?
  role         Role     @default(USER)
  isVerified   Boolean  @default(false)
  bio          String?

  // Email verification
  verificationToken        String?
  verificationTokenExpiry  DateTime?

  // Reset password
  resetToken        String?
  resetTokenExpiry  DateTime?

  // Relations
  refreshTokens RefreshToken[]
  activities   ActivityLog[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  USER
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model ActivityLog {
  id         String   @id @default(cuid())
  type       String
  user       User?    @relation(fields: [userId], references: [id])
  userId     String?
  ipAddress  String?
  userAgent  String?
  success    Boolean  @default(true)
  timestamp  DateTime @default(now())
  metadata   Json?
}
```

## Migrations

- Create with `npx prisma migrate dev --name <desc>`
- Production rollout with `npx prisma migrate deploy`

## Seed Data (Optional)

Create an admin user on first run:

```ts
// prisma/seed.ts
const admin = await prisma.user.upsert({
  where: { email: 'admin@stackinsight.app' },
  update: {},
  create: {
    email: 'admin@stackinsight.app',
    password: await bcrypt.hash('ChangeMe123', 10),
    role: 'ADMIN',
    isVerified: true
  }
});
```

## Indexes & Performance

- `User.email` unique
- `RefreshToken.token` unique
- Consider index on `ActivityLog.timestamp` and `ActivityLog.userId`

## Soft Delete (Optional)

Add `deletedAt` to models that need soft-deletion.

## Multi-Tenancy (Optional)

Introduce `tenantId` column across models if needed.
