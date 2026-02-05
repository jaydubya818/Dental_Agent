#!/usr/bin/env node
/**
 * Fix package-lock.json to use devOptional instead of dev + optional
 * 
 * Issue: Some packages have both "dev": true and "optional": true set,
 * which are mutually exclusive per npm specification. These should use
 * "devOptional": true instead.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const lockfilePath = join(__dirname, '..', 'package-lock.json');

console.log('🔍 Analyzing package-lock.json...\n');

// Read the lockfile
const lockfileContent = readFileSync(lockfilePath, 'utf-8');
const lockfile = JSON.parse(lockfileContent);

let fixCount = 0;



// Fix both node_modules and packages sections
if (lockfile.packages) {
  for (const packageName in lockfile.packages) {
    const pkg = lockfile.packages[packageName];
    if (pkg.dev === true && pkg.optional === true) {
      delete pkg.dev;
      delete pkg.optional;
      pkg.devOptional = true;
      fixCount++;
    }
  }
}

console.log(`✅ Fixed ${fixCount} packages with conflicting dev+optional flags`);

if (fixCount > 0) {
  // Write back to file with proper formatting
  writeFileSync(lockfilePath, JSON.stringify(lockfile, null, 2) + '\n', 'utf-8');
  console.log('✨ package-lock.json has been updated!\n');
  console.log('Changes:');
  console.log('  - Removed dual "dev": true and "optional": true flags');
  console.log('  - Added "devOptional": true flag instead\n');
} else {
  console.log('✅ No issues found - package-lock.json is already correct!\n');
}
