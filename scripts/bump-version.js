#!/usr/bin/env node

/**
 * Version Bump Script
 * 
 * Automatically bumps the version in package.json and updates version references
 * throughout the codebase.
 * 
 * Usage:
 *   npm run version:bump [patch|minor|major]
 *   npm run version:bump:patch
 *   npm run version:bump:minor
 *   npm run version:bump:major
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getCurrentVersion() {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
  );
  return packageJson.version;
}

function bumpVersion(type = 'patch') {
  const validTypes = ['patch', 'minor', 'major'];
  if (!validTypes.includes(type)) {
    log(`❌ Invalid bump type: ${type}. Must be one of: ${validTypes.join(', ')}`, 'red');
    process.exit(1);
  }

  const currentVersion = getCurrentVersion();
  log(`\n📦 Current version: ${currentVersion}`, 'blue');

  try {
    // Bump version in package.json (without creating a git tag)
    execSync(`npm version ${type} --no-git-tag-version`, { stdio: 'inherit' });
    
    const newVersion = getCurrentVersion();
    log(`✅ Bumped to: ${newVersion}`, 'green');

    // Update version in other files
    updateVersionInFiles(newVersion);

    return { currentVersion, newVersion };
  } catch (error) {
    log(`❌ Error bumping version: ${error.message}`, 'red');
    process.exit(1);
  }
}

function updateVersionInFiles(newVersion) {
  log('\n🔍 Updating version references in codebase...', 'yellow');

  const filesToUpdate = [
    'components/footer.tsx',
    'app/layout.tsx',
    'README.md',
  ];

  let filesUpdated = 0;

  filesToUpdate.forEach((filePath) => {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const versionRegex = /v\d+\.\d+\.\d+/g;
        
        if (versionRegex.test(content)) {
          content = content.replace(versionRegex, `v${newVersion}`);
          fs.writeFileSync(fullPath, content, 'utf8');
          log(`  ✓ Updated ${filePath}`, 'green');
          filesUpdated++;
        }
      } catch (error) {
        log(`  ⚠ Could not update ${filePath}: ${error.message}`, 'yellow');
      }
    }
  });

  if (filesUpdated > 0) {
    log(`\n✅ Updated version in ${filesUpdated} file(s)`, 'green');
  } else {
    log('\n⚠ No additional files needed updating', 'yellow');
  }
}

function createGitCommit(currentVersion, newVersion, type) {
  log('\n📝 Creating git commit...', 'yellow');

  try {
    // Stage all changes
    execSync('git add package.json package-lock.json', { stdio: 'inherit' });
    
    // Stage any other files that were updated
    const filesToStage = [
      'components/footer.tsx',
      'app/layout.tsx',
      'README.md',
    ];

    filesToStage.forEach((file) => {
      const fullPath = path.join(__dirname, '..', file);
      if (fs.existsSync(fullPath)) {
        try {
          execSync(`git add ${file}`, { stdio: 'pipe' });
        } catch (error) {
          // File might not have changes, ignore
        }
      }
    });

    // Create commit
    const commitMessage = `chore: bump version to v${newVersion}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

    // Create git tag
    execSync(`git tag v${newVersion}`, { stdio: 'inherit' });

    log(`✅ Created commit and tag v${newVersion}`, 'green');
    log('\n💡 Run "git push && git push --tags" to push changes', 'blue');
  } catch (error) {
    log(`⚠ Could not create git commit: ${error.message}`, 'yellow');
    log('💡 You can manually commit the changes', 'blue');
  }
}

function showUsage() {
  log('\n📖 Usage:', 'bright');
  log('  npm run version:bump [patch|minor|major]', 'blue');
  log('  npm run version:bump:patch  # 1.0.0 → 1.0.1', 'blue');
  log('  npm run version:bump:minor  # 1.0.0 → 1.1.0', 'blue');
  log('  npm run version:bump:major  # 1.0.0 → 2.0.0', 'blue');
  log('\n📝 Commit Message Conventions:', 'bright');
  log('  patch: Bug fixes, small changes', 'blue');
  log('  minor: New features, backwards compatible', 'blue');
  log('  major: Breaking changes', 'blue');
  log('');
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const bumpType = args[0] || 'patch';

  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    process.exit(0);
  }

  log('\n🚀 SellerFi Version Bump Tool', 'bright');
  log('═'.repeat(50), 'blue');

  const { currentVersion, newVersion } = bumpVersion(bumpType);

  // Ask if user wants to create a git commit
  const shouldCommit = args.includes('--commit') || args.includes('-c');
  
  if (shouldCommit) {
    createGitCommit(currentVersion, newVersion, bumpType);
  } else {
    log('\n💡 Run with --commit flag to automatically create git commit and tag', 'blue');
  }

  log('\n✨ Version bump complete!', 'green');
  log('═'.repeat(50), 'blue');
}

main();
