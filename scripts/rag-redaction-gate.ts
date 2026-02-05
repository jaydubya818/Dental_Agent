/**
 * RAG Redaction Gate Script
 * Scans all stored content for forbidden terms
 * FAILS CI build if forbidden terms detected
 * 
 * Usage: npm run rag:gate
 */

import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma';
import { containsForbiddenTerms, getForbiddenTerms } from '../lib/rag/redaction';

const RAG_DOCS_DIR = path.join(process.cwd(), 'rag_docs');

interface ScanResult {
  location: string;
  hasViolations: boolean;
  violations: string[];
}

/**
 * Scan seed documents folder
 */
async function scanSeedDocuments(): Promise<ScanResult[]> {
  const results: ScanResult[] = [];

  if (!fs.existsSync(RAG_DOCS_DIR)) {
    console.log('⚠️  rag_docs/ directory not found, skipping seed docs scan');
    return results;
  }

  const files = fs.readdirSync(RAG_DOCS_DIR)
    .filter(f => f.endsWith('.txt') || f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(RAG_DOCS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (containsForbiddenTerms(content)) {
      results.push({
        location: `rag_docs/${file}`,
        hasViolations: true,
        violations: ['Contains forbidden terms in seed document'],
      });
    }
  }

  return results;
}

/**
 * Scan stored RAG documents
 */
async function scanStoredDocuments(): Promise<ScanResult[]> {
  const results: ScanResult[] = [];

  try {
    const documents = await prisma.ragDocument.findMany({
      select: {
        id: true,
        title: true,
        rawTextCleaned: true,
      },
    });

    for (const doc of documents) {
      const violations: string[] = [];

      // Check title
      if (containsForbiddenTerms(doc.title)) {
        violations.push('Title contains forbidden terms');
      }

      // Check cleaned text
      if (containsForbiddenTerms(doc.rawTextCleaned)) {
        violations.push('Cleaned text contains forbidden terms');
      }

      if (violations.length > 0) {
        results.push({
          location: `RagDocument(${doc.id}): "${doc.title}"`,
          hasViolations: true,
          violations,
        });
      }
    }
  } catch (error: any) {
    if (error.code === 'P2021') {
      console.log('⚠️  RagDocument table does not exist yet, skipping database scan');
      return results;
    }
    throw error;
  }

  return results;
}

/**
 * Scan stored RAG chunks
 */
async function scanStoredChunks(): Promise<ScanResult[]> {
  const results: ScanResult[] = [];

  try {
    const chunks = await prisma.ragChunk.findMany({
      select: {
        id: true,
        documentId: true,
        content: true,
      },
    });

    for (const chunk of chunks) {
      if (containsForbiddenTerms(chunk.content)) {
        results.push({
          location: `RagChunk(${chunk.id}) in document ${chunk.documentId}`,
          hasViolations: true,
          violations: ['Chunk content contains forbidden terms'],
        });
      }
    }
  } catch (error: any) {
    if (error.code === 'P2021') {
      console.log('⚠️  RagChunk table does not exist yet, skipping chunk scan');
      return results;
    }
    throw error;
  }

  return results;
}

/**
 * Main scan function
 */
async function runRedactionGate() {
  console.log('🔒 Running RAG Redaction Gate...\n');
  console.log('Forbidden terms being scanned:');
  getForbiddenTerms().forEach(term => console.log(`  - ${term}`));
  console.log('');

  const allResults: ScanResult[] = [];

  // Scan seed documents
  console.log('📁 Scanning seed documents...');
  const seedResults = await scanSeedDocuments();
  allResults.push(...seedResults);
  console.log(`   Found ${seedResults.filter(r => r.hasViolations).length} violations\n`);

  // Scan stored documents
  console.log('💾 Scanning stored RAG documents...');
  const docResults = await scanStoredDocuments();
  allResults.push(...docResults);
  console.log(`   Found ${docResults.filter(r => r.hasViolations).length} violations\n`);

  // Scan stored chunks
  console.log('📦 Scanning stored RAG chunks...');
  const chunkResults = await scanStoredChunks();
  allResults.push(...chunkResults);
  console.log(`   Found ${chunkResults.filter(r => r.hasViolations).length} violations\n`);

  // Report results
  const violations = allResults.filter(r => r.hasViolations);
  
  console.log('='.repeat(70));
  console.log('📊 Redaction Gate Results');
  console.log('='.repeat(70));

  if (violations.length === 0) {
    console.log('✅ PASS: No forbidden terms detected\n');
    console.log(`Scanned:`);
    console.log(`  - ${seedResults.length} seed documents`);
    console.log(`  - ${docResults.length} stored documents`);
    console.log(`  - ${chunkResults.length} stored chunks\n`);
    return 0; // Success
  }

  console.log(`❌ FAIL: Found ${violations.length} violation(s)\n`);
  
  violations.forEach((result, idx) => {
    console.log(`${idx + 1}. ${result.location}`);
    result.violations.forEach(v => console.log(`   - ${v}`));
    console.log('');
  });

  console.log('='.repeat(70));
  console.log('⚠️  BUILD MUST FAIL - Forbidden terms detected!');
  console.log('='.repeat(70));
  console.log('\nAction required:');
  console.log('1. Remove or replace the forbidden terms in the source files');
  console.log('2. Re-run ingestion: npm run rag:ingest');
  console.log('3. Re-run gate: npm run rag:gate\n');

  return 1; // Failure
}

// Run the gate
runRedactionGate()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error running redaction gate:', error);
    process.exit(1);
  });
