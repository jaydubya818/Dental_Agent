#!/usr/bin/env tsx

/**
 * CSP Compliance Audit Script
 * 
 * Scans the codebase for potential CSP violations and unsafe patterns
 * that might break with strict Content Security Policy.
 * 
 * Usage:
 *   npx tsx scripts/audit-csp-compliance.ts
 *   npm run audit:csp (if added to package.json)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

interface Issue {
  file: string;
  line: number;
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  code?: string;
}

const issues: Issue[] = [];

// Patterns to detect
const PATTERNS = {
  // High-risk patterns (will definitely break with strict CSP)
  eval: {
    regex: /\beval\s*\(/g,
    type: 'error' as const,
    category: 'eval-usage',
    message: 'Direct eval() usage detected - will be blocked by CSP',
  },
  functionConstructor: {
    regex: /\bnew\s+Function\s*\(/g,
    type: 'error' as const,
    category: 'function-constructor',
    message: 'Function constructor detected - will be blocked by CSP',
  },
  inlineEventHandlers: {
    regex: /<\w+[^>]*\s(on\w+)=["'][^"']*["']/g,
    type: 'error' as const,
    category: 'inline-events',
    message: 'Inline HTML event handler detected - will be blocked by CSP',
  },
  
  // Medium-risk patterns (might need adjustment)
  dangerouslySetInnerHTML: {
    regex: /dangerouslySetInnerHTML/g,
    type: 'warning' as const,
    category: 'dangerous-html',
    message: 'dangerouslySetInnerHTML detected - ensure no script injection',
  },
  inlineStyleAttr: {
    regex: /\bstyle\s*=\s*{/g,
    type: 'info' as const,
    category: 'inline-styles',
    message: 'Inline style object detected - generally safe but review',
  },
  
  // Low-risk patterns (informational)
  scriptTag: {
    regex: /<script[^>]*>/g,
    type: 'warning' as const,
    category: 'script-tag',
    message: 'Script tag detected - ensure it uses nonce or is external',
  },
};

const EXTENSIONS_TO_SCAN = ['.ts', '.tsx', '.js', '.jsx'];
const IGNORE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.vercel',
  'public',
  'playwright-report',
  'test-results',
  '.turbo',
  '.cache',
];

function shouldIgnoreFile(filePath: string): boolean {
  return IGNORE_DIRS.some(dir => filePath.includes(dir));
}

function scanFile(filePath: string) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Skip if file is in node_modules, build artifacts, or CSP-related code
  if (shouldIgnoreFile(filePath) || 
      filePath.includes('lib/security/') ||
      filePath.includes('scripts/audit-csp-compliance')) {
    return;
  }

  for (const [patternName, pattern] of Object.entries(PATTERNS)) {
    lines.forEach((line, index) => {
      const matches = line.match(pattern.regex);
      if (matches) {
        // Skip comments
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
          return;
        }

        issues.push({
          file: relative(process.cwd(), filePath),
          line: index + 1,
          type: pattern.type,
          category: pattern.category,
          message: pattern.message,
          code: line.trim(),
        });
      }
    });
  }
}

function scanDirectory(dir: string) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry)) {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = fullPath.substring(fullPath.lastIndexOf('.'));
      if (EXTENSIONS_TO_SCAN.includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

function printReport() {
  console.log('\n🔒 CSP Compliance Audit Report\n');
  console.log('═'.repeat(80));

  if (issues.length === 0) {
    console.log('✅ No CSP compliance issues found!\n');
    return;
  }

  // Group by type
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  const info = issues.filter(i => i.type === 'info');

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}) - Will break with strict CSP:\n`);
    errors.forEach(issue => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`  └─ ${issue.message}`);
      if (issue.code) {
        console.log(`     Code: ${issue.code.substring(0, 80)}${issue.code.length > 80 ? '...' : ''}`);
      }
      console.log();
    });
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}) - Review for potential issues:\n`);
    warnings.forEach(issue => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`  └─ ${issue.message}`);
      if (issue.code) {
        console.log(`     Code: ${issue.code.substring(0, 80)}${issue.code.length > 80 ? '...' : ''}`);
      }
      console.log();
    });
  }

  if (info.length > 0) {
    console.log(`\nℹ️  INFO (${info.length}) - Informational:\n`);
    info.forEach(issue => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`  └─ ${issue.message}`);
      console.log();
    });
  }

  console.log('═'.repeat(80));
  console.log(`\nTotal issues: ${issues.length} (${errors.length} errors, ${warnings.length} warnings, ${info.length} info)\n`);

  // Recommendations
  if (errors.length > 0) {
    console.log('📋 Recommendations:\n');
    console.log('  1. Replace eval() calls with safe alternatives (JSON.parse, etc.)');
    console.log('  2. Remove Function constructor usage');
    console.log('  3. Convert inline event handlers to React event handlers');
    console.log('  4. Review script tags and add nonces where needed');
    console.log('  5. See docs/security/CSP_MIGRATION_GUIDE.md for details\n');
  }

  // Exit with error if critical issues found
  if (errors.length > 0) {
    console.log('❌ CSP audit failed due to critical issues\n');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('⚠️  CSP audit completed with warnings\n');
    process.exit(0);
  } else {
    console.log('✅ CSP audit passed\n');
    process.exit(0);
  }
}

// Main execution
console.log('🔍 Scanning codebase for CSP compliance issues...\n');

try {
  scanDirectory(process.cwd());
  printReport();
} catch (error) {
  console.error('Error during CSP audit:', error);
  process.exit(1);
}
