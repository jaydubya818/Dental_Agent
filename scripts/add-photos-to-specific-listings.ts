/**
 * Add photos to specific high-value listings
 */

import { prisma } from "../lib/prisma"

async function main() {
  // Find listings by title keywords
  const industrialListing = await prisma.listing.findFirst({
    where: {
      title: {
        contains: "Industrial Components",
        mode: "insensitive",
      },
    },
  })

  const ecommerceListing = await prisma.listing.findFirst({
    where: {
      title: {
        contains: "E-Commerce Niche",
        mode: "insensitive",
      },
    },
  })

  const manufacturingPhotos = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
  ]

  const ecommercePhotos = [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80",
  ]

  if (industrialListing) {
    await prisma.listing.update({
      where: { id: industrialListing.id },
      data: {
        photos: manufacturingPhotos,
        heroPhotoIndex: 0,
      },
    })
    console.log("✅ Added photos to Industrial Components Manufacturer")
  }

  if (ecommerceListing) {
    await prisma.listing.update({
      where: { id: ecommerceListing.id },
      data: {
        photos: ecommercePhotos,
        heroPhotoIndex: 0,
      },
    })
    console.log("✅ Added photos to E-Commerce Niche Retailer")
  }

  console.log("\n🎉 Done! Refresh your browser to see the photos.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
