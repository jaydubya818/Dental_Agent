/**
 * Seed Verified Revenue Test Data
 * 
 * Creates test data for Phase 2 verified revenue features:
 * - Seller with profile and listings
 * - VerifiedMetric records (REVENUE from multiple sources)
 * - ListingTrustSnapshot records
 * - RevenueIntegrationAccount records (simulating connected providers)
 * 
 * Run: npx tsx scripts/seed-verified-revenue-test.ts
 */

import { PrismaClient, MetricType, MetricSource, MetricStatus, MetricValueType, RevenueProvider, ConnectionStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const TEST_SELLER_EMAIL = 'verified-seller@test.com'
const TEST_SELLER_PASSWORD = 'password123'

async function main() {
  console.log('🌱 Seeding Verified Revenue Test Data...\n')

  // 1. Create or get test seller
  const passwordHash = await bcrypt.hash(TEST_SELLER_PASSWORD, 12)
  
  let seller = await prisma.user.findUnique({
    where: { email: TEST_SELLER_EMAIL }
  })

  if (!seller) {
    console.log('Creating test seller user...')
    seller = await prisma.user.create({
      data: {
        email: TEST_SELLER_EMAIL,
        passwordHash,
        firstName: 'Verified',
        lastName: 'Seller',
        role: 'SELLER',
        emailVerified: true,
        isActive: true,
      }
    })
    console.log(`  ✅ Created seller: ${seller.email}`)
  } else {
    console.log(`  ⏭️  Seller already exists: ${seller.email}`)
  }

  // 2. Create seller profile if it doesn't exist
  let sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: seller.id }
  })

  if (!sellerProfile) {
    console.log('Creating seller profile...')
    sellerProfile = await prisma.sellerProfile.create({
      data: {
        userId: seller.id,
        companyName: 'Test Verified Business LLC',
        businessType: 'LLC',
        yearsInBusiness: 5,
        identityVerified: true,
        businessVerified: true,
      }
    })
    console.log(`  ✅ Created seller profile`)
  } else {
    console.log(`  ⏭️  Seller profile already exists`)
  }

  // 3. Create test listings
  console.log('\nCreating test listings...')
  
  const listingsData = [
    {
      title: 'Profitable SaaS Business - Verified Revenue',
      teaserSummary: 'A thriving SaaS business with verified Stripe revenue.',
      description: 'A thriving SaaS business with verified Stripe revenue. Perfect for testing verified revenue badges.',
      industry: 'Technology',
      city: 'San Francisco',
      state: 'CA',
      grossRevenue: 150000,
    },
    {
      title: 'E-commerce Store - QuickBooks Verified',
      teaserSummary: 'An established e-commerce store with QuickBooks-verified revenue.',
      description: 'An established e-commerce store with QuickBooks-verified revenue.',
      industry: 'E-commerce',
      city: 'Austin',
      state: 'TX',
      grossRevenue: 80000,
    },
    {
      title: 'Local Service Business - Multiple Verifications',
      teaserSummary: 'A local service business with both Stripe and QuickBooks verified revenue.',
      description: 'A local service business with both Stripe and QuickBooks verified revenue.',
      industry: 'Services',
      city: 'Miami',
      state: 'FL',
      grossRevenue: 120000,
    },
    {
      title: 'Restaurant Business - No Verification',
      teaserSummary: 'A restaurant business without verified revenue - for testing empty states.',
      description: 'A restaurant business without verified revenue - for testing empty states.',
      industry: 'Food & Beverage',
      city: 'Denver',
      state: 'CO',
      grossRevenue: 60000,
    },
  ]

  const listings = []
  for (const listingData of listingsData) {
    let listing = await prisma.listing.findFirst({
      where: { title: listingData.title }
    })

    if (!listing) {
      listing = await prisma.listing.create({
        data: {
          ...listingData,
          sellerId: seller.id,
          assetType: 'BUSINESS',
          status: 'ACTIVE',
          isFeatured: true,
          featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          publishedAt: new Date(),
        }
      })
      console.log(`  ✅ Created listing: ${listing.title}`)
      
      // Create ListingFinancials for the listing
      await prisma.listingFinancials.create({
        data: {
          listingId: listing.id,
          askingPrice: listingData.grossRevenue ? listingData.grossRevenue * 3 : 300000,
          annualRevenue: listingData.grossRevenue,
          priceNegotiable: true,
        }
      })
      console.log(`    ✅ Created financials for listing`)
    } else {
      console.log(`  ⏭️  Listing exists: ${listing.title}`)
    }
    listings.push(listing)
  }

  // 4. Create VerifiedMetric records
  console.log('\nCreating verified metrics...')
  
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  // Listing 1: Stripe verified
  await prisma.verifiedMetric.upsert({
    where: {
      listingId_type_source_periodStart_periodEnd: {
        listingId: listings[0].id,
        type: MetricType.REVENUE,
        source: MetricSource.STRIPE,
        periodStart: thirtyDaysAgo,
        periodEnd: now,
      }
    },
    update: {
      value: 12500,
      confidence: 0.95,
      status: MetricStatus.VERIFIED,
    },
    create: {
      listingId: listings[0].id,
      type: MetricType.REVENUE,
      source: MetricSource.STRIPE,
      value: 12500,
      valueType: MetricValueType.MONEY,
      currency: 'USD',
      periodStart: thirtyDaysAgo,
      periodEnd: now,
      periodDays: 30,
      confidence: 0.95,
      status: MetricStatus.VERIFIED,
      verifiedAt: now,
      expiresAt,
      metadata: {
        definition: 'Gross charges minus refunds over 30 days',
        transactionCount: 156,
      },
    }
  })
  console.log(`  ✅ Created Stripe metric for listing 1`)

  // Listing 2: QuickBooks verified
  await prisma.verifiedMetric.upsert({
    where: {
      listingId_type_source_periodStart_periodEnd: {
        listingId: listings[1].id,
        type: MetricType.REVENUE,
        source: MetricSource.QUICKBOOKS,
        periodStart: thirtyDaysAgo,
        periodEnd: now,
      }
    },
    update: {
      value: 6666,
      confidence: 0.92,
      status: MetricStatus.VERIFIED,
    },
    create: {
      listingId: listings[1].id,
      type: MetricType.REVENUE,
      source: MetricSource.QUICKBOOKS,
      value: 6666,
      valueType: MetricValueType.MONEY,
      currency: 'USD',
      periodStart: thirtyDaysAgo,
      periodEnd: now,
      periodDays: 30,
      confidence: 0.92,
      status: MetricStatus.VERIFIED,
      verifiedAt: now,
      expiresAt,
      metadata: {
        definition: 'Accrual-basis income from P&L',
        accountType: 'income',
      },
    }
  })
  console.log(`  ✅ Created QuickBooks metric for listing 2`)

  // Listing 3: Multiple sources (Stripe + QuickBooks + Plaid)
  await prisma.verifiedMetric.upsert({
    where: {
      listingId_type_source_periodStart_periodEnd: {
        listingId: listings[2].id,
        type: MetricType.REVENUE,
        source: MetricSource.STRIPE,
        periodStart: thirtyDaysAgo,
        periodEnd: now,
      }
    },
    update: {
      value: 5000,
      confidence: 0.95,
      status: MetricStatus.VERIFIED,
    },
    create: {
      listingId: listings[2].id,
      type: MetricType.REVENUE,
      source: MetricSource.STRIPE,
      value: 5000,
      valueType: MetricValueType.MONEY,
      currency: 'USD',
      periodStart: thirtyDaysAgo,
      periodEnd: now,
      periodDays: 30,
      confidence: 0.95,
      status: MetricStatus.VERIFIED,
      verifiedAt: now,
      expiresAt,
      metadata: { definition: 'Gross charges minus refunds' },
    }
  })

  await prisma.verifiedMetric.upsert({
    where: {
      listingId_type_source_periodStart_periodEnd: {
        listingId: listings[2].id,
        type: MetricType.REVENUE,
        source: MetricSource.QUICKBOOKS,
        periodStart: thirtyDaysAgo,
        periodEnd: now,
      }
    },
    update: {
      value: 3500,
      confidence: 0.90,
      status: MetricStatus.VERIFIED,
    },
    create: {
      listingId: listings[2].id,
      type: MetricType.REVENUE,
      source: MetricSource.QUICKBOOKS,
      value: 3500,
      valueType: MetricValueType.MONEY,
      currency: 'USD',
      periodStart: thirtyDaysAgo,
      periodEnd: now,
      periodDays: 30,
      confidence: 0.90,
      status: MetricStatus.VERIFIED,
      verifiedAt: now,
      expiresAt,
      metadata: { definition: 'Cash-basis income' },
    }
  })

  await prisma.verifiedMetric.upsert({
    where: {
      listingId_type_source_periodStart_periodEnd: {
        listingId: listings[2].id,
        type: MetricType.REVENUE,
        source: MetricSource.PLAID,
        periodStart: thirtyDaysAgo,
        periodEnd: now,
      }
    },
    update: {
      value: 1500,
      confidence: 0.85,
      status: MetricStatus.VERIFIED,
    },
    create: {
      listingId: listings[2].id,
      type: MetricType.REVENUE,
      source: MetricSource.PLAID,
      value: 1500,
      valueType: MetricValueType.MONEY,
      currency: 'USD',
      periodStart: thirtyDaysAgo,
      periodEnd: now,
      periodDays: 30,
      confidence: 0.85,
      status: MetricStatus.VERIFIED,
      verifiedAt: now,
      expiresAt,
      metadata: { definition: 'Bank account deposits categorized as income' },
    }
  })
  console.log(`  ✅ Created 3 metrics for listing 3 (multi-source)`)

  // 5. Create ListingTrustSnapshot records
  console.log('\nCreating trust score snapshots...')

  const trustSnapshots = [
    { listingId: listings[0].id, trustScore: 78, confidence: 0.85 },
    { listingId: listings[1].id, trustScore: 72, confidence: 0.80 },
    { listingId: listings[2].id, trustScore: 85, confidence: 0.90 },
    { listingId: listings[3].id, trustScore: 45, confidence: 0.50 },
  ]

  for (const snapshot of trustSnapshots) {
    // Check if snapshot already exists
    const existing = await prisma.listingTrustSnapshot.findFirst({
      where: { listingId: snapshot.listingId }
    })
    
    if (existing) {
      await prisma.listingTrustSnapshot.update({
        where: { id: existing.id },
        data: {
          trustScore: snapshot.trustScore,
          confidence: snapshot.confidence,
          computedAt: now,
        }
      })
    } else {
      await prisma.listingTrustSnapshot.create({
        data: {
          listingId: snapshot.listingId,
          trustScore: snapshot.trustScore,
          confidence: snapshot.confidence,
          subscores: {
            revenue: snapshot.trustScore > 60 ? 35 : 15,
            traffic: 20,
            reviews: snapshot.trustScore > 70 ? 18 : 5,
            completeness: 10,
          },
          computedAt: now,
          inputsHash: `test-${snapshot.listingId}`,
          version: 1,
        }
      })
    }
  }
  console.log(`  ✅ Created ${trustSnapshots.length} trust score snapshots`)

  // 6. Create RevenueIntegrationAccount records (simulating connected providers)
  console.log('\nCreating revenue integration accounts...')

  // Active QuickBooks connection
  await prisma.revenueIntegrationAccount.upsert({
    where: {
      userId_provider: {
        userId: seller.id,
        provider: RevenueProvider.QUICKBOOKS,
      }
    },
    update: {
      status: ConnectionStatus.ACTIVE,
      lastSyncedAt: now,
    },
    create: {
      userId: seller.id,
      provider: RevenueProvider.QUICKBOOKS,
      externalAccountId: 'test-qb-realm-123',
      encryptedAccessToken: 'encrypted-test-access-token',
      encryptedRefreshToken: 'encrypted-test-refresh-token',
      tokenExpiresAt: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
      status: ConnectionStatus.ACTIVE,
      lastSyncedAt: now,
      metadata: {
        companyName: 'Test Verified Business LLC',
        companyId: '123456789',
      },
    }
  })
  console.log(`  ✅ Created QuickBooks integration account (ACTIVE)`)

  // Expired Plaid connection (for testing reconnect UX)
  await prisma.revenueIntegrationAccount.upsert({
    where: {
      userId_provider: {
        userId: seller.id,
        provider: RevenueProvider.PLAID,
      }
    },
    update: {
      status: ConnectionStatus.EXPIRED,
      errorMessage: 'Bank connection expired. Please reconnect.',
    },
    create: {
      userId: seller.id,
      provider: RevenueProvider.PLAID,
      externalAccountId: 'test-plaid-item-456',
      encryptedAccessToken: 'encrypted-expired-token',
      status: ConnectionStatus.EXPIRED,
      errorMessage: 'Bank connection expired. Please reconnect.',
      metadata: {
        institutionName: 'Test Bank',
        accountMask: '1234',
      },
    }
  })
  console.log(`  ✅ Created Plaid integration account (EXPIRED - for reconnect testing)`)

  // Error state Stripe connection (for testing error UX)
  await prisma.revenueIntegrationAccount.upsert({
    where: {
      userId_provider: {
        userId: seller.id,
        provider: RevenueProvider.STRIPE,
      }
    },
    update: {
      status: ConnectionStatus.ERROR,
      errorMessage: 'Authorization revoked by user. Please reconnect.',
    },
    create: {
      userId: seller.id,
      provider: RevenueProvider.STRIPE,
      externalAccountId: 'acct_test_error_789',
      encryptedAccessToken: 'encrypted-error-token',
      status: ConnectionStatus.ERROR,
      errorMessage: 'Authorization revoked by user. Please reconnect.',
      metadata: {
        stripeAccountType: 'standard',
      },
    }
  })
  console.log(`  ✅ Created Stripe integration account (ERROR - for error UX testing)`)

  // 7. Summary
  console.log('\n' + '='.repeat(60))
  console.log('✅ Verified Revenue Test Data Seeded Successfully!')
  console.log('='.repeat(60))
  console.log('\n📋 Test Accounts:')
  console.log(`   Email: ${TEST_SELLER_EMAIL}`)
  console.log(`   Password: ${TEST_SELLER_PASSWORD}`)
  console.log('\n📊 Test Data Created:')
  console.log(`   - 1 Seller with profile`)
  console.log(`   - 4 Listings (3 with verified revenue, 1 without)`)
  console.log(`   - 5 VerifiedMetric records`)
  console.log(`   - 4 ListingTrustSnapshot records`)
  console.log(`   - 3 RevenueIntegrationAccount records`)
  console.log('     - QuickBooks: ACTIVE')
  console.log('     - Plaid: EXPIRED (for reconnect testing)')
  console.log('     - Stripe: ERROR (for error UX testing)')
  console.log('\n🧪 Test Scenarios Available:')
  console.log('   1. Verified Revenue Badges - Browse listings page')
  console.log('   2. "Verified Revenue Only" Filter - Listings filter')
  console.log('   3. Trust Score Display - Listing detail pages')
  console.log('   4. Seller Dashboard - /dashboard/seller/verified-metrics')
  console.log('   5. Empty State - Listing without metrics')
  console.log('   6. Reconnect UX - Expired/Error provider states')
  console.log('   7. Enhanced Tooltip - Multi-source listing (#3)')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
