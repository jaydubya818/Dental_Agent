/**
 * Manual test script to check all super admin pages
 * Run with: npx tsx scripts/test-admin-pages.ts
 */

const pages = [
  '/super-admin',
  '/super-admin/users',
  '/super-admin/listings',
  '/super-admin/dealrooms',
  '/super-admin/subscriptions',
  '/super-admin/payments',
  '/super-admin/usage',
  '/super-admin/analytics',
  '/super-admin/reports',
  '/super-admin/knowledge-base',
  '/super-admin/audit-logs',
]

const BASE_URL = 'http://localhost:3000'

async function testPage(path: string) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    })
    
    const status = response.status
    const statusText = response.statusText
    
    if (status === 200) {
      console.log(`✅ ${path} - OK`)
    } else if (status === 307 || status === 302) {
      console.log(`🔄 ${path} - Redirect (${status}) - Requires auth`)
    } else {
      console.log(`❌ ${path} - Error (${status} ${statusText})`)
    }
  } catch (error) {
    console.log(`❌ ${path} - Failed to fetch: ${error}`)
  }
}

async function main() {
  console.log('Testing Super Admin Pages...\n')
  console.log('Note: Pages requiring auth will show as redirects\n')
  
  for (const page of pages) {
    await testPage(page)
  }
  
  console.log('\n✅ Test complete!')
  console.log('\nTo test with authentication, sign in at http://localhost:3000/auth/signin')
  console.log('Email: jaydubya818a@yahoo.com')
  console.log('Password: Alan818west')
}

main()
