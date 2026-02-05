/**
 * Seed Test Accounts for Production Readiness Testing
 * 
 * Creates 7 test accounts for each buyer and seller tier as per the plan:
 * - buyer-free@test.com (FREE buyer)
 * - buyer-pro@test.com (PRO buyer, $19/mo)
 * - buyer-elite@test.com (ELITE buyer, $79/mo)
 * - seller-basic@test.com (Basic seller, $19.95/mo)
 * - seller-featured@test.com (Featured seller, $39/mo)
 * - seller-premium@test.com (Premium seller, $59/mo)
 * - seller-managed@test.com (Managed sale seller, $899)
 * 
 * All accounts use password: password123
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_PASSWORD = 'password123'

interface TestAccount {
  email: string
  role: 'BUYER' | 'SELLER' | 'ADMIN'
  firstName: string
  lastName: string
  password?: string // Optional custom password, defaults to password123
  buyerPlan?: 'FREE' | 'PRO'
  sellerPlan?: 'NONE' | 'STARTER' | 'FEATURED' | 'ELITE'
  isEliteBuyer?: boolean
  buyerTier?: 'REGISTERED' | 'QUALIFIED_BUYER' | 'ELITE_INVESTOR'
  subscriptionStatus?: 'ACTIVE'
}

const testAccounts: TestAccount[] = [
  // Buyer accounts
  {
    email: 'buyer-free@test.com',
    role: 'BUYER',
    firstName: 'Free',
    lastName: 'Buyer',
    buyerPlan: 'FREE',
    buyerTier: 'REGISTERED',
  },
  {
    email: 'buyer-pro@test.com',
    role: 'BUYER',
    firstName: 'Pro',
    lastName: 'Buyer',
    buyerPlan: 'PRO',
    buyerTier: 'QUALIFIED_BUYER',
    subscriptionStatus: 'ACTIVE',
  },
  {
    email: 'buyer-elite@test.com',
    role: 'BUYER',
    firstName: 'Elite',
    lastName: 'Buyer',
    buyerPlan: 'PRO', // Elite buyers are PRO + isEliteBuyer flag
    isEliteBuyer: true,
    buyerTier: 'ELITE_INVESTOR',
    subscriptionStatus: 'ACTIVE',
  },
  // Seller accounts
  {
    email: 'seller-basic@test.com',
    role: 'SELLER',
    firstName: 'Basic',
    lastName: 'Seller',
    sellerPlan: 'STARTER',
    subscriptionStatus: 'ACTIVE',
  },
  {
    email: 'seller-featured@test.com',
    role: 'SELLER',
    firstName: 'Featured',
    lastName: 'Seller',
    sellerPlan: 'FEATURED',
    subscriptionStatus: 'ACTIVE',
  },
  {
    email: 'seller-premium@test.com',
    role: 'SELLER',
    firstName: 'Premium',
    lastName: 'Seller',
    sellerPlan: 'ELITE',
    subscriptionStatus: 'ACTIVE',
  },
  {
    email: 'seller-managed@test.com',
    role: 'SELLER',
    firstName: 'Managed',
    lastName: 'Seller',
    sellerPlan: 'ELITE',
    subscriptionStatus: 'ACTIVE',
  },
  // Admin accounts
  {
    email: 'admin@test.com',
    role: 'ADMIN',
    firstName: 'Test',
    lastName: 'Admin',
  },

]

async function main() {
  console.log('🌱 Starting test account seeding...\n')

  // Pre-hash default password for efficiency
  const defaultPasswordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12)

  for (const account of testAccounts) {
    console.log(`Creating ${account.email}...`)
    
    // Use custom password if provided, otherwise use default
    const passwordHash = account.password 
      ? await bcrypt.hash(account.password, 12)
      : defaultPasswordHash

    // Check if user already exists using raw query to avoid schema issues
    const existingUsers = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "User" WHERE email = ${account.email} LIMIT 1
    `

    if (existingUsers.length > 0) {
      console.log(`  ⏭️  User already exists, skipping`)
      continue
    }

    // Create user using raw SQL to avoid schema mismatch issues
    const userId = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    await prisma.$executeRaw`
      INSERT INTO "User" (
        "id", "email", "passwordHash", "role", "firstName", "lastName",
        "emailVerified", "isActive", "isEliteBuyer", "buyerTier", "createdAt", "updatedAt"
      ) VALUES (
        ${userId}, ${account.email}, ${passwordHash}, ${account.role}::"UserRole",
        ${account.firstName}, ${account.lastName}, true, true,
        ${account.isEliteBuyer ?? false}, ${account.buyerTier ?? 'REGISTERED'}::"BuyerTier",
        NOW(), NOW()
      )
    `

    // Create buyer profile for buyers
    if (account.role === 'BUYER') {
      const profileId = `profile_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const hasPaidPlan = account.buyerPlan === 'PRO' || account.isEliteBuyer
      
      // Use explicit SQL to avoid boolean interpolation issues
      if (hasPaidPlan) {
        await prisma.$executeRaw`
          INSERT INTO "BuyerProfile" (
            "id", "userId", "capitalAvailableMin", "capitalAvailableMax",
            "targetPriceMin", "targetPriceMax", "profileCompleteness",
            "qualificationBadge", "canAccessNDA", "capitalConfirmed",
            "hasIndustryExp", "createdAt", "updatedAt"
          ) VALUES (
            ${profileId}, ${userId}, 100000, 500000, 100000, 500000, 80,
            true, true, true, false, NOW(), NOW()
          )
        `
      } else {
        await prisma.$executeRaw`
          INSERT INTO "BuyerProfile" (
            "id", "userId", "capitalAvailableMin", "capitalAvailableMax",
            "targetPriceMin", "targetPriceMax", "profileCompleteness",
            "qualificationBadge", "canAccessNDA", "capitalConfirmed",
            "hasIndustryExp", "createdAt", "updatedAt"
          ) VALUES (
            ${profileId}, ${userId}, 100000, 500000, 100000, 500000, 80,
            false, false, false, false, NOW(), NOW()
          )
        `
      }
    }

    // Create seller profile for sellers
    if (account.role === 'SELLER') {
      const profileId = `seller_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const isVerified = account.sellerPlan !== 'STARTER'
      
      await prisma.$executeRaw`
        INSERT INTO "SellerProfile" (
          "id", "userId", "companyName", "businessType", "yearsInBusiness",
          "identityVerified", "businessVerified", "createdAt", "updatedAt"
        ) VALUES (
          ${profileId}, ${userId}, ${account.firstName + "'s Business"}, 'Small Business', 5,
          true, ${isVerified}, NOW(), NOW()
        )
      `
    }

    // Create subscription for paid tiers
    if (account.subscriptionStatus) {
      const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`
      
      // Map account types to subscription tier and type
      let tier = 'FREE'
      let subType = 'PRO_BUYER'
      
      if (account.role === 'BUYER') {
        if (account.isEliteBuyer) {
          tier = 'PRO'
          subType = 'ELITE_INVESTOR'
        } else if (account.buyerPlan === 'PRO') {
          tier = 'BASIC'
          subType = 'PRO_BUYER'
        }
      } else {
        // Seller
        subType = 'PRO_SELLER'
        if (account.sellerPlan === 'STARTER') {
          tier = 'BASIC'
        } else if (account.sellerPlan === 'FEATURED') {
          tier = 'PRO'
        } else if (account.sellerPlan === 'ELITE') {
          tier = 'ENTERPRISE'
        }
      }
      
      // Determine buyerPlan and sellerPlan
      const buyerPlan = account.buyerPlan || 'FREE'
      const sellerPlan = account.sellerPlan || 'NONE'
      
      await prisma.$executeRaw`
        INSERT INTO "Subscription" (
          "id", "userId", "stripeSubscriptionId", "stripeCustomerId",
          "status", "currentPeriodStart", "currentPeriodEnd",
          "tier", "type", "buyerPlan", "sellerPlan", "createdAt", "updatedAt"
        ) VALUES (
          ${subId}, ${userId}, ${'sub_test_' + userId}, ${'cus_test_' + userId},
          'ACTIVE'::"SubscriptionStatus", NOW(), NOW() + INTERVAL '30 days',
          ${tier}::"SubscriptionTier", ${subType}::"SubscriptionType",
          ${buyerPlan}::"BuyerPlan", ${sellerPlan}::"SellerPlan", NOW(), NOW()
        )
      `
    }

    console.log(`  ✅ Created ${account.email}`)
  }

  console.log('\n✨ Test account seeding complete!')
  console.log('\n📋 Test Accounts Summary:')
  console.log('─────────────────────────────────────────────')
  console.log('| Email                      | Role   | Plan      |')
  console.log('─────────────────────────────────────────────')
  for (const account of testAccounts) {
    const plan = account.buyerPlan || account.sellerPlan || 'N/A'
    const elite = account.isEliteBuyer ? ' (Elite)' : ''
    console.log(`| ${account.email.padEnd(26)} | ${account.role.padEnd(6)} | ${plan.padEnd(9)}${elite} |`)
  }
  console.log('─────────────────────────────────────────────')
  console.log(`\n🔑 See documentation for test account credentials`)
}

main()
  .catch((e) => {
    console.error('Error seeding test accounts:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
