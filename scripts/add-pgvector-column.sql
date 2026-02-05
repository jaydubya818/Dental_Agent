-- Add pgvector extension and column to Embedding table
-- Run this after your initial Prisma migration

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add vector column to Embedding table
-- Note: Prisma doesn't support vector type directly, so we use raw SQL
ALTER TABLE "Embedding" ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

-- 3. Create index for similarity search (optional but recommended for performance)
-- This uses HNSW index for fast approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS embedding_vector_idx ON "Embedding" 
USING hnsw (embedding vector_cosine_ops);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Embedding' AND column_name = 'embedding';

