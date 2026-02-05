/**
 * Seed production database with listing photos
 * Run with: npx tsx scripts/seed-production-photos.ts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Curated Unsplash photos for each business type
const photosByType: Record<string, string[]> = {
  saas: [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
  ],
  manufacturing: [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=800&fit=crop",
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&h=800&fit=crop",
  ],
  ecommerce: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80",
  ],
  gym: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&h=800&fit=crop",
  ],
  hvac: [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&h=800&fit=crop",
  ],
}

async function main() {
  console.log("🖼️  Seeding production photos...")

  // Get all active listings without photos
  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { photos: { isEmpty: true } },
        { photos: null },
      ],
    },
    select: {
      id: true,
      title: true,
    },
  })

  console.log(`\nFound ${listings.length} listings without photos\n`)

  if (listings.length === 0) {
    console.log("✅ All active listings already have photos!")
    return
  }

  let updated = 0

  for (const listing of listings) {
    // Determine photo type based on title keywords
    let photos: string[] = []
    const title = listing.title.toLowerCase()

    if (title.includes("saas") || title.includes("software") || title.includes("subscription")) {
      photos = photosByType.saas
    } else if (title.includes("manufacturing") || title.includes("industrial") || title.includes("components")) {
      photos = photosByType.manufacturing
    } else if (title.includes("restaurant") || title.includes("cafe") || title.includes("bakery") || title.includes("food")) {
      photos = photosByType.restaurant
    } else if (title.includes("ecommerce") || title.includes("e-commerce") || title.includes("retail")) {
      photos = photosByType.ecommerce
    } else if (title.includes("gym") || title.includes("fitness") || title.includes("classes")) {
      photos = photosByType.gym
    } else if (title.includes("hvac") || title.includes("heating") || title.includes("cooling")) {
      photos = photosByType.hvac
    } else {
      // Default to first photo from SaaS category
      photos = [photosByType.saas[0]]
    }

    await prisma.listing.update({
      where: { id: listing.id },
      data: { 
        photos,
        heroPhotoIndex: 0,
      },
    })

    updated++
    console.log(`✅ ${listing.title} - Added ${photos.length} photo(s)`)
  }

  console.log(`\n✨ Successfully updated ${updated} listings with photos!`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding photos:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
