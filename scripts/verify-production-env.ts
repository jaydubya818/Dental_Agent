#!/usr/bin/env tsx
/**
 * Production Environment Verification Script
 * Checks if all required environment variables are properly configured
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.production.local') });
config({ path: resolve(process.cwd(), '.env.production') });
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

interface EnvCheck {
  name: string;
  required: boolean;
  category: string;
  validator?: (value: string) => boolean;
}

const ENV_CHECKS: EnvCheck[] = [
  // Authentication
  { name: 'NEXTAUTH_URL', required: true, category: 'Authentication' },
  { name: 'NEXTAUTH_SECRET', required: true, category: 'Authentication', validator: (v) => v.length >= 32 },
  { name: 'NEXT_SERVER_ACTIONS_ENCRYPTION_KEY', required: true, category: 'Authentication', validator: (v) => v.length >= 32 },
  
  // Database
  { name: 'DATABASE_URL', required: true, category: 'Database', validator: (v) => v.startsWith('postgresql://') },
  
  // OpenAI
  { name: 'OPENAI_API_KEY', required: true, category: 'AI Features', validator: (v) => v.startsWith('sk-') },
  
  // Stripe
  { name: 'STRIPE_SECRET_KEY', required: false, category: 'Payments' },
  { name: 'STRIPE_PUBLISHABLE_KEY', required: false, category: 'Payments' },
  { name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', required: false, category: 'Payments' },
  { name: 'STRIPE_WEBHOOK_SECRET', required: false, category: 'Payments' },
  
  // Optional
  { name: 'BYPASS_ADVISOR_CHECK', required: false, category: 'Optional' },
  { name: 'SENTRY_DSN', required: false, category: 'Monitoring' },
  { name: 'UPSTASH_REDIS_URL', required: false, category: 'Caching' },
  { name: 'UPSTASH_REDIS_TOKEN', required: false, category: 'Caching' },
];

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  category: string;
}

function checkEnvironment(): CheckResult[] {
  const results: CheckResult[] = [];
  
  for (const check of ENV_CHECKS) {
    const value = process.env[check.name];
    
    if (!value) {
      results.push({
        name: check.name,
        status: check.required ? 'fail' : 'warning',
        message: check.required ? 'Missing (REQUIRED)' : 'Missing (optional)',
        category: check.category,
      });
      continue;
    }
    
    // Validate value if validator provided
    if (check.validator && !check.validator(value)) {
      results.push({
        name: check.name,
        status: 'fail',
        message: 'Invalid format',
        category: check.category,
      });
      continue;
    }
    
    // Mask sensitive values
    const maskedValue = value.length > 10 
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
      : '***';
    
    results.push({
      name: check.name,
      status: 'pass',
      message: `Set (${maskedValue})`,
      category: check.category,
    });
  }
  
  return results;
}

function printResults(results: CheckResult[]) {
  console.log('\n🔍 Production Environment Verification\n');
  console.log('=' .repeat(80));
  
  // Group by category
  const categories = [...new Set(results.map(r => r.category))];
  
  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category);
    const passCount = categoryResults.filter(r => r.status === 'pass').length;
    const totalCount = categoryResults.length;
    
    console.log(`\n📦 ${category} (${passCount}/${totalCount})`);
    console.log('-'.repeat(80));
    
    for (const result of categoryResults) {
      const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
      console.log(`${icon} ${result.name.padEnd(40)} ${result.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  
  // Summary
  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warnCount = results.filter(r => r.status === 'warning').length;
  
  console.log(`\n📊 Summary: ${passCount} passed, ${failCount} failed, ${warnCount} warnings\n`);
  
  if (failCount > 0) {
    console.log('❌ FAILED: Required environment variables are missing or invalid');
    console.log('\n💡 To fix:');
    console.log('   1. Add missing variables to Vercel: https://vercel.com/jaydubya818/seller-fi/settings/environment-variables');
    console.log('   2. Or add to .env.production.local for local testing');
    console.log('   3. Run this script again to verify\n');
    process.exit(1);
  } else if (warnCount > 0) {
    console.log('⚠️  WARNING: Some optional variables are missing');
    console.log('   Platform will work but some features may be limited\n');
  } else {
    console.log('✅ SUCCESS: All required environment variables are properly configured!\n');
  }
}

// Run checks
const results = checkEnvironment();
printResults(results);
