-- Ensure required extension exists (idempotent)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Set default for emailVerified and enforce NOT NULL
ALTER TABLE "User"
  ALTER COLUMN "emailVerified" SET DEFAULT false;

-- Backfill any NULLs to false (safe if column was nullable earlier)
UPDATE "User"
SET "emailVerified" = false
WHERE "emailVerified" IS NULL;

ALTER TABLE "User"
  ALTER COLUMN "emailVerified" SET NOT NULL;

-- Set default for createdAt and enforce NOT NULL
ALTER TABLE "User"
  ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "createdAt" SET NOT NULL;
