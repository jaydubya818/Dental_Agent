#!/usr/bin/env node
/**
 * Check package-lock.json for packages with conflicting dev + optional flags
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const lockfilePath = join(__dirname, '..', 'package-lock.json');

console.log('🔍 Checking package-lock.json for conflicting flags...\n');

const lockfileContent = readFileSync(lockfilePath, 'utf-8');
const lockfile = JSON.parse(lockfileContent);

const issues = [];

if (lockfile.packages) {
  for (const [packageName, pkg] of Object.entries(lockfile.packages)) {
    if (pkg.dev === true && pkg.optional === true) {
      issues.push({
        name: packageName || '(root)',
        dev: pkg.dev,
        optional: pkg.optional
      });
    }
  }
}

if (issues.length > 0) {
  console.log(`❌ Found ${issues.length} packages with conflicting flags:\n`);
  issues.forEach(issue => {
    console.log(`  - ${issue.name}`);
  });
  console.log('\nThese packages have both "dev": true and "optional": true,');
  console.log('which are mutually exclusive per npm specification.');
  console.log('\nRun: node scripts/fix-package-lock.mjs to fix this issue.\n');
  process.exit(1);
} else {
  console.log('✅ No conflicting flags found!');
  console.log('✨ package-lock.json is valid.\n');
  process.exit(0);
}
