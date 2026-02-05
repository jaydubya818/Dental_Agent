#!/usr/bin/env tsx
/**
 * Bundle Size Analysis Script
 * Analyzes the Next.js build output to identify large bundles
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface BundleInfo {
  name: string;
  size: number;
  gzipSize?: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function analyzeBuildManifest() {
  const manifestPath = join(process.cwd(), '.next/build-manifest.json');
  
  if (!existsSync(manifestPath)) {
    console.log('❌ Build manifest not found. Run `npm run build` first.');
    process.exit(1);
  }
  
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  
  console.log('\n📦 Bundle Size Analysis\n');
  console.log('='.repeat(80));
  
  // Analyze pages
  console.log('\n📄 Pages:');
  console.log('-'.repeat(80));
  
  const pages = Object.keys(manifest.pages || {});
  for (const page of pages.slice(0, 20)) {
    console.log(`  ${page}`);
  }
  
  if (pages.length > 20) {
    console.log(`  ... and ${pages.length - 20} more pages`);
  }
  
  console.log(`\n📊 Total Pages: ${pages.length}`);
  
  // Analyze chunks
  console.log('\n🧩 Shared Chunks:');
  console.log('-'.repeat(80));
  
  const chunks = manifest.sortedPages || [];
  console.log(`  Total Chunks: ${chunks.length}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('\n💡 Recommendations:');
  console.log('   1. Use dynamic imports for heavy components');
  console.log('   2. Implement code splitting for routes');
  console.log('   3. Lazy load modals and dialogs');
  console.log('   4. Use next/dynamic for client-only components');
  console.log('   5. Review and remove unused dependencies\n');
}

function checkLargePackages() {
  const packageJsonPath = join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  const heavyPackages = [
    '@radix-ui',
    'framer-motion',
    'recharts',
    'socket.io',
    'jspdf',
  ];
  
  console.log('\n📦 Large Dependencies:');
  console.log('-'.repeat(80));
  
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  for (const [name, version] of Object.entries(deps)) {
    if (heavyPackages.some(heavy => name.includes(heavy))) {
      console.log(`  ${name.padEnd(50)} ${version}`);
    }
  }
  
  console.log('\n💡 Consider:');
  console.log('   - Use dynamic imports for heavy packages');
  console.log('   - Load charts only when needed');
  console.log('   - Lazy load Socket.IO client');
  console.log('   - Use lighter alternatives where possible\n');
}

// Run analysis
console.log('\n🔍 Analyzing Next.js Bundle...\n');

try {
  analyzeBuildManifest();
  checkLargePackages();
  
  console.log('✅ Analysis complete!\n');
  console.log('📖 For detailed bundle analysis, run:');
  console.log('   npx @next/bundle-analyzer\n');
} catch (error) {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
}
