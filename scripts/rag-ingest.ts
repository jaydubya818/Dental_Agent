/**
 * RAG Document Ingestion Script
 * Usage: npm run rag:ingest
 */

import fs from 'fs';
import path from 'path';
import { ingestDocument } from '../lib/rag/ingestion';
import { getIngestionStats } from '../lib/rag/ingestion';

const RAG_DOCS_DIR = path.join(process.cwd(), 'rag_docs');

/**
 * Ingest all documents from rag_docs folder
 */
async function ingestAllDocuments() {
  console.log('🚀 Starting RAG document ingestion...\n');

  // Ensure directory exists
  if (!fs.existsSync(RAG_DOCS_DIR)) {
    console.log(`📁 Creating ${RAG_DOCS_DIR} directory...`);
    fs.mkdirSync(RAG_DOCS_DIR, { recursive: true });
    console.log('✅ Directory created. Please add documents and run again.\n');
    return;
  }

  // Get all .txt and .md files
  const files = fs.readdirSync(RAG_DOCS_DIR)
    .filter(f => f.endsWith('.txt') || f.endsWith('.md'));

  if (files.length === 0) {
    console.log('⚠️  No documents found in rag_docs/');
    console.log('Add .txt or .md files to rag_docs/ and run again.\n');
    return;
  }

  console.log(`📄 Found ${files.length} documents to ingest:\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(RAG_DOCS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract category from filename (e.g., "seller_financing_guide.txt" -> "seller_financing")
    const category = file.split('_')[0] || 'general';
    const title = file.replace(/\.(txt|md)$/, '').replace(/_/g, ' ');

    console.log(`\n📌 Processing: ${file}`);
    console.log(`   Category: ${category}`);

    try {
      const result = await ingestDocument({
        title,
        category,
        sourceType: 'EXTERNAL',
        rawText: content,
      });

      if (result.success) {
        console.log(`   ✅ Success!`);
        console.log(`   - Document ID: ${result.documentId}`);
        console.log(`   - Chunks created: ${result.chunksCreated}`);
        console.log(`   - Embeddings: ${result.embeddingsCreated}`);
        if (result.redactionCount && result.redactionCount > 0) {
          console.log(`   - ⚠️  Redacted ${result.redactionCount} forbidden term(s)`);
        }
        successCount++;
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
        errorCount++;
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Ingestion Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log('='.repeat(60) + '\n');

  // Show overall stats
  const stats = await getIngestionStats();
  console.log('📈 Overall Statistics:');
  console.log(`   Total documents: ${stats.totalDocuments}`);
  console.log(`   Processed: ${stats.processedDocuments}`);
  console.log(`   Errors: ${stats.errorDocuments}`);
  console.log(`   Total chunks: ${stats.totalChunks}`);
  console.log(`   Avg chunks/doc: ${stats.avgChunksPerDoc}`);
  
  if (stats.categories.length > 0) {
    console.log('\n   Categories:');
    stats.categories.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat.count} documents`);
    });
  }

  console.log('\n✨ Ingestion complete!\n');
}

// Run ingestion
ingestAllDocuments()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
