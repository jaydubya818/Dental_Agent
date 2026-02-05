/**
 * Seed Script: Add Sample Photos to Listings
 * 
 * This script adds placeholder/sample photos to existing listings
 * that don't have photos yet. Useful for testing and demo purposes.
 * 
 * Usage:
 *   npx tsx scripts/seed-listing-photos.ts
 */

import { prisma } from "../lib/prisma"

// Sample business photos from Unsplash (free to use)
const SAMPLE_PHOTOS = {
  RESTAURANT: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", // Restaurant interior
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", // Restaurant food
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80", // Restaurant exterior
  ],
  RETAIL: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80", // Retail store
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80", // Retail products
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80", // Retail interior
  ],
  ECOMMERCE: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", // E-commerce workspace
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80", // Shipping boxes
    "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80", // Online shopping
  ],
  SAAS: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", // Tech dashboard
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80", // Team working
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80", // Modern office
  ],
  MANUFACTURING: [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", // Factory floor
    "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80", // Manufacturing equipment
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80", // Industrial facility
  ],
  SERVICE: [
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80", // Service team
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80", // Professional services
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80", // Service delivery
  ],
  DEFAULT: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", // Modern building
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", // Office space
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80", // Business meeting
  ],
}

/**
 * Map asset type to photo category
 */
function getPhotoCategory(assetType: string | null): keyof typeof SAMPLE_PHOTOS {
  if (!assetType) return "DEFAULT"
  
  const type = assetType.toUpperCase()
  
  if (type.includes("RESTAURANT") || type.includes("FOOD")) return "RESTAURANT"
  if (type.includes("RETAIL") || type.includes("STORE")) return "RETAIL"
  if (type.includes("ECOMMERCE") || type.includes("ONLINE")) return "ECOMMERCE"
  if (type.includes("SAAS") || type.includes("SOFTWARE")) return "SAAS"
  if (type.includes("MANUFACTURING") || type.includes("INDUSTRIAL")) return "MANUFACTURING"
  if (type.includes("SERVICE")) return "SERVICE"
  
  return "DEFAULT"
}

async function main() {
  console.log("🖼️  Starting photo seed script...\n")

  // Find all active listings
  const allListings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      title: true,
      assetType: true,
      photos: true,
    },
    take: 50, // Limit to first 50 listings
  })

  // Filter out listings that already have photos
  const listingsWithoutPhotos = allListings.filter(
    listing => !listing.photos || listing.photos.length === 0
  )

  console.log(`Found ${listingsWithoutPhotos.length} listings without photos\n`)

  if (listingsWithoutPhotos.length === 0) {
    console.log("✅ All active listings already have photos!")
    return
  }

  let updatedCount = 0

  for (const listing of listingsWithoutPhotos) {
    const category = getPhotoCategory(listing.assetType)
    const photos = SAMPLE_PHOTOS[category]

    try {
      await prisma.listing.update({
        where: { id: listing.id },
        data: {
          photos: photos,
          heroPhotoIndex: 0, // Set first photo as hero
        },
      })

      updatedCount++
      console.log(`✅ Added ${photos.length} photos to: ${listing.title} (${category})`)
    } catch (error) {
      console.error(`❌ Failed to update listing ${listing.id}:`, error)
    }
  }

  console.log(`\n🎉 Successfully added photos to ${updatedCount} listings!`)
  console.log("\n💡 Tip: You can now see these photos on the listings page")
  console.log("   Run: npm run dev and visit /listings")
}

main()
  .catch((error) => {
    console.error("❌ Error running seed script:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
