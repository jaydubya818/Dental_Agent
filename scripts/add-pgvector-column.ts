/**
 * Add pgvector column to Embedding table
 * Run with: npx ts-node scripts/add-pgvector-column.ts
 * 
 * This script:
 * 1. Enables the pgvector extension
 * 2. Adds the vector(1536) column to the Embedding table
 * 3. Creates an HNSW index for fast similarity search
 */

import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

async function addPgVectorColumn() {
  console.log("🔧 Adding pgvector extension and column...")

  try {
    // Read SQL file
    const sqlPath = join(__dirname, "add-pgvector-column.sql")
    const sql = readFileSync(sqlPath, "utf-8")

    // Split into individual statements
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 60)}...`)
        await prisma.$executeRawUnsafe(statement)
      }
    }

    console.log("✅ pgvector extension and column added successfully!")
    console.log("\n📝 Next steps:")
    console.log("   1. Update lib/embeddings.ts to use actual vector storage")
    console.log("   2. Update searchSimilarChunks() to use pgvector cosine similarity")
    console.log("   3. Test embedding generation and search")
  } catch (error) {
    console.error("❌ Error adding pgvector column:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  addPgVectorColumn()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { addPgVectorColumn }

