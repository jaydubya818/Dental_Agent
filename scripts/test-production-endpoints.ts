#!/usr/bin/env tsx
/**
 * Production Endpoint Testing Script
 * Tests critical API endpoints to verify production deployment
 */

interface EndpointTest {
  name: string;
  url: string;
  method: 'GET' | 'POST';
  expectedStatus: number[];
  validator?: (response: Response, body: any) => boolean;
}

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://seller-fi.vercel.app';

const ENDPOINT_TESTS: EndpointTest[] = [
  {
    name: 'Homepage',
    url: '/',
    method: 'GET',
    expectedStatus: [200],
    validator: (_, body) => body.includes('SellerFi'),
  },
  {
    name: 'Auth Session',
    url: '/api/auth/session',
    method: 'GET',
    expectedStatus: [200],
    validator: (_, body) => typeof body === 'object',
  },
  {
    name: 'Auth Providers',
    url: '/api/auth/providers',
    method: 'GET',
    expectedStatus: [200],
    validator: (_, body) => typeof body === 'object',
  },
  {
    name: 'Auth CSRF',
    url: '/api/auth/csrf',
    method: 'GET',
    expectedStatus: [200],
    validator: (_, body) => body.csrfToken !== undefined,
  },
  {
    name: 'Listings Page',
    url: '/listings',
    method: 'GET',
    expectedStatus: [200],
  },
  {
    name: 'Pricing Page',
    url: '/pricing',
    method: 'GET',
    expectedStatus: [200],
  },
  {
    name: 'How It Works',
    url: '/how-it-works',
    method: 'GET',
    expectedStatus: [200],
  },
];

async function testEndpoint(test: EndpointTest): Promise<{
  name: string;
  status: 'pass' | 'fail';
  message: string;
  responseTime: number;
}> {
  const startTime = Date.now();
  
  try {
    const url = `${PRODUCTION_URL}${test.url}`;
    const response = await fetch(url, {
      method: test.method,
      headers: {
        'User-Agent': 'SellerFi-Production-Test/1.0',
      },
    });
    
    const responseTime = Date.now() - startTime;
    
    // Check status code
    if (!test.expectedStatus.includes(response.status)) {
      return {
        name: test.name,
        status: 'fail',
        message: `Expected ${test.expectedStatus.join(' or ')}, got ${response.status}`,
        responseTime,
      };
    }
    
    // Get response body
    const contentType = response.headers.get('content-type');
    let body: any;
    
    if (contentType?.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }
    
    // Run validator if provided
    if (test.validator && !test.validator(response, body)) {
      return {
        name: test.name,
        status: 'fail',
        message: 'Validation failed',
        responseTime,
      };
    }
    
    return {
      name: test.name,
      status: 'pass',
      message: `${response.status} OK`,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      name: test.name,
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
    };
  }
}

async function runTests() {
  console.log('\n🧪 Testing Production Endpoints\n');
  console.log(`Target: ${PRODUCTION_URL}`);
  console.log('='.repeat(80));
  
  const results = [];
  
  for (const test of ENDPOINT_TESTS) {
    process.stdout.write(`\nTesting ${test.name.padEnd(30)} ... `);
    const result = await testEndpoint(test);
    results.push(result);
    
    const icon = result.status === 'pass' ? '✅' : '❌';
    const time = `${result.responseTime}ms`;
    console.log(`${icon} ${result.message.padEnd(30)} (${time})`);
  }
  
  console.log('\n' + '='.repeat(80));
  
  // Summary
  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const avgResponseTime = Math.round(
    results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
  );
  
  console.log(`\n📊 Summary: ${passCount}/${results.length} passed, ${failCount} failed`);
  console.log(`⏱️  Average response time: ${avgResponseTime}ms\n`);
  
  if (failCount > 0) {
    console.log('❌ FAILED: Some endpoints are not responding correctly');
    console.log('\n💡 To fix:');
    console.log('   1. Check Vercel deployment status');
    console.log('   2. Review Vercel function logs for errors');
    console.log('   3. Verify environment variables are set correctly\n');
    process.exit(1);
  } else {
    console.log('✅ SUCCESS: All endpoints are responding correctly!\n');
  }
}

// Run tests
runTests().catch(console.error);
