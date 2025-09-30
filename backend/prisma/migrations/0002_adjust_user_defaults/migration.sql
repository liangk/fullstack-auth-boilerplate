-- Migration 0002: Ensure User table defaults and constraints
-- This migration is idempotent and safe to re-run

-- Ensure required extension exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Backfill any NULL values before enforcing constraints
UPDATE "User"
SET "emailVerified" = false
WHERE "emailVerified" IS NULL;

UPDATE "User"
SET "createdAt" = CURRENT_TIMESTAMP
WHERE "createdAt" IS NULL;

-- Note: Defaults and NOT NULL constraints already exist from 0001_init
-- This migration just ensures data consistency
