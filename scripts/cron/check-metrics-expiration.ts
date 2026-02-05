/**
 * Verified Metrics Expiration Monitoring Cron Job
 * 
 * Checks for verified metrics expiring within 7 days and sends warning emails
 * to listing owners so they can refresh their connections.
 * 
 * Runs daily at 9:00 AM.
 * 
 * Safeguards:
 * - lastWarningAt field prevents duplicate warnings
 * - Min 3 days between warnings
 * - Only send to verified email addresses
 * - Rate limit: 50 emails per minute
 * 
 * @see https://github.com/jaydubya818/SellerFi/issues/36
 * 
 * Run manually: npx tsx scripts/cron/check-metrics-expiration.ts
 */

import { prisma } from '../../lib/prisma'
import { sendMetricExpirationWarningEmail } from '../../lib/email/workflow-emails'

const MIN_DAYS_BETWEEN_WARNINGS = 3
const RATE_LIMIT_PER_MINUTE = 50
const EXPIRATION_WARNING_DAYS = 7

interface ExpiringMetric {
  id: string
  listingId: string
  type: string
  expiresAt: Date
  listing: {
    id: string
    title: string
    seller: {
      id: string
      email: string
      firstName: string | null
      emailVerified: boolean
    }
  }
}

interface CheckResult {
  metricsFound: number
  emailsSent: number
  emailsSkipped: number
  errors: string[]
}

/**
 * Check for expiring metrics and send warning emails
 */
export async function checkMetricsExpiration(): Promise<CheckResult> {
  const result: CheckResult = {
    metricsFound: 0,
    emailsSent: 0,
    emailsSkipped: 0,
    errors: []
  }

  const now = new Date()
  const warningThreshold = new Date(now.getTime() + EXPIRATION_WARNING_DAYS * 24 * 60 * 60 * 1000)
  const minWarningGap = new Date(now.getTime() - MIN_DAYS_BETWEEN_WARNINGS * 24 * 60 * 60 * 1000)

  try {
    // Find verified metrics expiring within the warning window
    const expiringMetrics = await prisma.verifiedMetric.findMany({
      where: {
        status: 'VERIFIED',
        expiresAt: {
          gt: now, // Not yet expired
          lt: warningThreshold // Expiring within threshold
        },
        OR: [
          { lastWarningAt: null },
          { lastWarningAt: { lt: minWarningGap } }
        ]
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            seller: {
              select: {
                id: true,
                email: true,
                firstName: true,
                emailVerified: true
              }
            }
          }
        }
      }
    }) as unknown as ExpiringMetric[]

    result.metricsFound = expiringMetrics.length
    console.log(`[MetricsExpiration] Found ${expiringMetrics.length} expiring metrics`)

    if (expiringMetrics.length === 0) {
      return result
    }

    // Group by seller to avoid sending multiple emails
    const metricsBySeller = new Map<string, ExpiringMetric[]>()
    for (const metric of expiringMetrics) {
      if (!metric.listing?.seller) continue
      
      const sellerId = metric.listing.seller.id
      if (!metricsBySeller.has(sellerId)) {
        metricsBySeller.set(sellerId, [])
      }
      metricsBySeller.get(sellerId)!.push(metric)
    }

    // Process each seller
    let emailsSentThisMinute = 0
    const minuteStart = Date.now()

    for (const [sellerId, metrics] of metricsBySeller) {
      // Rate limiting
      if (emailsSentThisMinute >= RATE_LIMIT_PER_MINUTE) {
        const elapsed = Date.now() - minuteStart
        if (elapsed < 60000) {
          await sleep(60000 - elapsed)
          emailsSentThisMinute = 0
        }
      }

      const seller = metrics[0].listing.seller

      // Skip if email not verified
      if (!seller.emailVerified) {
        result.emailsSkipped++
        console.log(`[MetricsExpiration] Skipping ${seller.email} - email not verified`)
        continue
      }

      try {
        // Send consolidated email for all expiring metrics
        const emailResult = await sendMetricExpirationWarningEmail(
          seller.email,
          seller.firstName || undefined,
          metrics.map(m => ({
            listingId: m.listingId,
            listingTitle: m.listing.title,
            metricType: m.type,
            expiresAt: m.expiresAt
          })),
          sellerId
        )

        if (emailResult.success) {
          result.emailsSent++
          emailsSentThisMinute++

          // Update lastWarningAt for all processed metrics
          await prisma.verifiedMetric.updateMany({
            where: {
              id: { in: metrics.map(m => m.id) }
            },
            data: {
              lastWarningAt: now
            }
          })

          console.log(`[MetricsExpiration] Sent warning to ${seller.email} for ${metrics.length} metrics`)
        } else {
          result.emailsSkipped++
          result.errors.push(`Failed to send to ${seller.email}: ${emailResult.error}`)
        }
      } catch (error) {
        result.emailsSkipped++
        result.errors.push(`Error processing seller ${sellerId}: ${error}`)
      }
    }

    return result
  } catch (error) {
    console.error('[MetricsExpiration] Fatal error:', error)
    throw error
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Allow direct execution
if (require.main === module) {
  checkMetricsExpiration()
    .then(result => {
      console.log('[MetricsExpiration] Completed:', result)
      process.exit(0)
    })
    .catch(error => {
      console.error('[MetricsExpiration] Failed:', error)
      process.exit(1)
    })
}
