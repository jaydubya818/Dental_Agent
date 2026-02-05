#!/usr/bin/env tsx
/**
 * Seed production database with listing photos
 * Usage: DATABASE_URL="..." npx tsx scripts/seed-production-db.ts
 */

import { PrismaClient } from '@prisma/client'

// Photo URLs organized by business type
const PHOTO_URLS = {
  saas: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Analytics dashboard
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', // Data visualization
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop', // Team collaboration
  ],
  manufacturing: [
    'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=600&fit=crop', // Factory floor
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop', // Robot arm
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop', // Industrial equipment
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', // Restaurant interior
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', // Fine dining
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop', // Cafe
  ],
  ecommerce: [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', // Online shopping
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop', // Retail store
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop', // Shopping bags
  ],
  gym: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop', // Gym equipment
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop', // Fitness center
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop', // Workout
  ],
  hvac: [
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop', // HVAC unit
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop', // Air conditioning
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop', // Industrial HVAC
  ],
  default: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', // Modern building
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', // Office space
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop', // Business meeting
  ],
}

function categorizeListingByTitle(title: string): keyof typeof PHOTO_URLS {
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('saas') || lowerTitle.includes('software') || lowerTitle.includes('tech')) {
    return 'saas'
  }
  if (lowerTitle.includes('manufacturing') || lowerTitle.includes('factory')) {
    return 'manufacturing'
  }
  if (lowerTitle.includes('restaurant') || lowerTitle.includes('cafe') || lowerTitle.includes('food')) {
    return 'restaurant'
  }
  if (lowerTitle.includes('ecommerce') || lowerTitle.includes('e-commerce') || lowerTitle.includes('retail')) {
    return 'ecommerce'
  }
  if (lowerTitle.includes('gym') || lowerTitle.includes('fitness')) {
    return 'gym'
  }
  if (lowerTitle.includes('hvac') || lowerTitle.includes('heating') || lowerTitle.includes('cooling')) {
    return 'hvac'
  }
  
  return 'default'
}

async function main() {
  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required')
    console.error('Usage: DATABASE_URL="..." npx tsx scripts/seed-production-db.ts')
    process.exit(1)
  }

  console.log('🔗 Connecting to production database...')
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

  try {
    // First, fix the failed migration
    console.log('\n🔧 Fixing failed migration...')
    await prisma.$executeRaw`
      UPDATE _prisma_migrations 
      SET rolled_back_at = NOW() 
      WHERE migration_name = 'add_referral_system' 
      AND finished_at IS NULL 
      AND rolled_back_at IS NULL
    `
    console.log('✅ Migration marked as rolled back')

    // Get all listings without photos
    console.log('\n📸 Fetching listings without photos...')
    const listings = await prisma.listing.findMany({
      where: {
        OR: [
          { photos: { isEmpty: true } },
          { photos: { equals: null } },
        ],
      },
      select: {
        id: true,
        title: true,
        photos: true,
      },
    })

    console.log(`Found ${listings.length} listings without photos\n`)

    if (listings.length === 0) {
      console.log('✅ All listings already have photos!')
      return
    }

    // Seed photos for each listing
    let updated = 0
    for (const listing of listings) {
      const category = categorizeListingByTitle(listing.title)
      const photos = PHOTO_URLS[category]
      
      await prisma.listing.update({
        where: { id: listing.id },
        data: {
          photos: photos,
          heroPhotoIndex: 0,
        },
      })
      
      updated++
      console.log(`✅ ${updated}/${listings.length} - ${listing.title} (${category})`)
    }

    console.log(`\n🎉 Successfully seeded ${updated} listings with photos!`)
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
