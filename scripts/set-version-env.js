#!/usr/bin/env node

/**
 * Set Version Environment Variable
 * 
 * This script reads the version from package.json and outputs it as an
 * environment variable for use in builds (especially Vercel).
 * 
 * Usage:
 *   node scripts/set-version-env.js
 *   
 * In Vercel build settings, add this to "Build Command":
 *   export NEXT_PUBLIC_APP_VERSION=$(node scripts/set-version-env.js) && npm run build
 */

const fs = require('fs');
const path = require('path');

try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
  );
  
  // Output just the version number (no newline)
  process.stdout.write(packageJson.version);
  process.exit(0);
} catch (error) {
  console.error('Error reading version:', error.message);
  process.stdout.write('1.0.0'); // Fallback version
  process.exit(0);
}
