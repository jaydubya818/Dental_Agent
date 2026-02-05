-- Fix Failed Migration in Production Database
-- Run this directly on your Neon/Vercel production database

-- Delete the failed migration record so Prisma can re-apply a fixed version
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20260124000000_postgres_optimizations';

-- Step 3: Now you can run the safe migration manually or let Prisma run it
-- The safe migration will be applied on next deployment
