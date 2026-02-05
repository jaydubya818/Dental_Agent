/**
 * Weekly Digest Cron Job
 * 
 * Sends weekly digest emails to buyers and sellers.
 * Runs weekly on Sunday at 6:00 PM (user's timezone).
 * 
 * Safeguards:
 * - Only send to users with emailWeeklyDigest enabled
 * - Only send if user has activity in past week
 * - Rate limit: 100 emails per minute
 * - Advisory lock prevents concurrent runs
 * - Batch processing for efficiency
 * 
 * Run manually: npx tsx scripts/cron/send-weekly-digests.ts
 */

import { prisma } from '../../lib/prisma'
import { 
  processBuyerWeeklyDigests,
  processSellerWeeklyDigests 
} from '../../lib/email/digest-emails'

/**
 * Acquire advisory lock to prevent concurrent runs
 */
async function acquireAdvisoryLock(): Promise<boolean> {
  try {
    const result = await prisma.$queryRaw<Array<{ pg_try_advisory_lock: boolean }>>`
      SELECT pg_try_advisory_lock(1004) as pg_try_advisory_lock
    `
    return result[0]?.pg_try_advisory_lock || false
  } catch (error) {
    console.error('Error acquiring advisory lock:', error)
    return false
  }
}

/**
 * Release advisory lock
 */
async function releaseAdvisoryLock(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT pg_advisory_unlock(1004)`
  } catch (error) {
    console.error('Error releasing advisory lock:', error)
  }
}

/**
 * Main cron job function
 */
export async function sendWeeklyDigests() {
  console.log('📬 Starting weekly digest processing...')
  
  // Acquire lock
  const lockAcquired = await acquireAdvisoryLock()
  if (!lockAcquired) {
    console.log('⏭️  Another instance is running, skipping...')
    return { skipped: true, reason: 'lock_not_acquired' }
  }
  
  try {
    const startTime = Date.now()
    
    // Process buyer digests
    console.log('\n👥 Processing buyer digests...')
    const buyerResults = await processBuyerWeeklyDigests()
    
    // Wait a bit between buyer and seller processing
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Process seller digests
    console.log('\n💼 Processing seller digests...')
    const sellerResults = await processSellerWeeklyDigests()
    
    const duration = Math.round((Date.now() - startTime) / 1000)
    
    console.log(`\n📈 Weekly Digest Summary:`)
    console.log(`   👥 Buyer digests: ${buyerResults.sent} sent, ${buyerResults.skipped} skipped`)
    console.log(`   💼 Seller digests: ${sellerResults.sent} sent, ${sellerResults.skipped} skipped`)
    console.log(`   ⏱️  Duration: ${duration}s`)
    
    return {
      buyer: buyerResults,
      seller: sellerResults,
      duration
    }
    
  } finally {
    await releaseAdvisoryLock()
  }
}

// Run if called directly
if (require.main === module) {
  sendWeeklyDigests()
    .then((result) => {
      console.log('\n✨ Done!', result)
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error)
      process.exit(1)
    })
}
