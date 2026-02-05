/**
 * Seed script for Managed Sale demo data
 * Run with: npx tsx scripts/seed-managed-sale-demo.ts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding Managed Sale demo data...")

  // Find a seller user to associate with the demo application
  const seller = await prisma.user.findFirst({
    where: { role: "SELLER" },
  })

  if (!seller) {
    console.log("❌ No seller user found. Creating a demo seller...")
    
    // Create a demo seller if none exists
    const demoSeller = await prisma.user.create({
      data: {
        email: "demo-seller@sellerfi.com",
        passwordHash: "$2b$10$demo_hash_not_for_login", // Not a real hash
        role: "SELLER",
        firstName: "Demo",
        lastName: "Seller",
        emailVerified: true,
        isActive: true,
      },
    })
    
    console.log(`✅ Created demo seller: ${demoSeller.email}`)
  }

  const targetSeller = seller || await prisma.user.findFirst({ where: { role: "SELLER" } })

  if (!targetSeller) {
    console.log("❌ Could not find or create a seller. Exiting.")
    return
  }

  // Check if demo application already exists
  const existing = await prisma.managedSaleApplication.findFirst({
    where: {
      userId: targetSeller.id,
      businessName: "Bay Area Coffee Roasters",
    },
  })

  if (existing) {
    console.log("⚠️ Demo application already exists. Skipping creation.")
    console.log(`   Application ID: ${existing.id}`)
    return
  }

  // Create a demo managed sale application
  const application = await prisma.managedSaleApplication.create({
    data: {
      userId: targetSeller.id,
      status: "REVIEWING",
      
      // Business Info
      businessName: "Bay Area Coffee Roasters",
      industry: "Restaurants & Food Service",
      locationCity: "Oakland",
      locationState: "CA",
      askingPriceRangeMin: 350000,
      askingPriceRangeMax: 450000,
      yearsInBusiness: 8,
      numberOfEmployees: 12,
      
      // Financials
      annualRevenue: 720000,
      annualSDE: 145000,
      annualEBITDA: 120000,
      
      // Financial Readiness
      hasCleanBooks: true,
      usesBookkeeperOrCPA: true,
      hasTaxReturns: true,
      
      // Operations
      ownerInvolvement: "PART_TIME",
      hasLease: true,
      leaseTransferable: true,
      hasDebt: false,
      
      // Seller Financing
      willingToOfferSellerFinancing: true,
      sellerFinancingMinPercent: 15,
      sellerFinancingMaxPercent: 35,
      hasSBAEligibleProfile: true,
      
      // Timeline & Reason
      timelineToSell: "WITHIN_90_DAYS",
      reasonForSelling: "Looking to retire and spend more time with family. The business is well-established with loyal customers and a strong team in place.",
      
      // Contact
      contactName: "Michael Chen",
      contactEmail: targetSeller.email,
      contactPhone: "(510) 555-0123",
      
      // Consent
      marketingConsent: true,
      
      // Events
      events: {
        create: [
          {
            actorUserId: targetSeller.id,
            actorType: "SELLER",
            type: "APPLIED",
            message: "Application submitted for SellerFi Managed Sale",
          },
          {
            actorType: "SYSTEM",
            type: "STATUS_CHANGED",
            message: "Application moved to review queue",
            metadata: { previousStatus: "APPLIED", newStatus: "REVIEWING" },
          },
        ],
      },
      
      // Tasks
      tasks: {
        create: [
          {
            title: "Upload last 3 years of tax returns",
            status: "TODO",
          },
          {
            title: "Provide profit & loss statements",
            status: "TODO",
          },
          {
            title: "Share current lease agreement",
            status: "IN_PROGRESS",
          },
          {
            title: "Complete business questionnaire",
            status: "DONE",
          },
        ],
      },
    },
    include: {
      events: true,
      tasks: true,
    },
  })

  console.log("✅ Created demo managed sale application:")
  console.log(`   Business: ${application.businessName}`)
  console.log(`   Status: ${application.status}`)
  console.log(`   ID: ${application.id}`)
  console.log(`   Events: ${application.events.length}`)
  console.log(`   Tasks: ${application.tasks.length}`)

  // Create a second application in ACCEPTED status
  const application2 = await prisma.managedSaleApplication.create({
    data: {
      userId: targetSeller.id,
      status: "ACCEPTED",
      
      businessName: "TechRepair Pro Services",
      industry: "Technology & SaaS",
      locationCity: "San Jose",
      locationState: "CA",
      askingPriceRangeMin: 180000,
      askingPriceRangeMax: 250000,
      yearsInBusiness: 5,
      numberOfEmployees: 4,
      
      annualRevenue: 320000,
      annualSDE: 85000,
      
      hasCleanBooks: true,
      usesBookkeeperOrCPA: false,
      hasTaxReturns: true,
      
      ownerInvolvement: "FULL_TIME",
      hasLease: true,
      leaseTransferable: true,
      hasDebt: true,
      debtNotes: "Small equipment loan with 18 months remaining, $12,000 balance",
      
      willingToOfferSellerFinancing: true,
      sellerFinancingMinPercent: 10,
      sellerFinancingMaxPercent: 25,
      hasSBAEligibleProfile: true,
      
      timelineToSell: "FLEXIBLE",
      reasonForSelling: "Relocating to another state for family reasons.",
      
      contactName: "Sarah Martinez",
      contactEmail: targetSeller.email,
      contactPhone: "(408) 555-0456",
      
      marketingConsent: true,
      acceptanceTermsAgreedAt: new Date(),
      
      events: {
        create: [
          {
            actorUserId: targetSeller.id,
            actorType: "SELLER",
            type: "APPLIED",
            message: "Application submitted for SellerFi Managed Sale",
          },
          {
            actorType: "SYSTEM",
            type: "STATUS_CHANGED",
            message: "Application moved to review queue",
          },
          {
            actorType: "STAFF",
            type: "STATUS_CHANGED",
            message: "Application accepted! Welcome to SellerFi Managed Sale.",
            metadata: { previousStatus: "REVIEWING", newStatus: "ACCEPTED" },
          },
          {
            actorType: "STAFF",
            type: "MESSAGE",
            message: "Deal manager assigned. Preparing listing materials.",
          },
        ],
      },
      
      tasks: {
        create: [
          {
            title: "Review and approve listing draft",
            status: "TODO",
          },
          {
            title: "Schedule professional photo session",
            status: "TODO",
          },
        ],
      },
    },
  })

  console.log("\n✅ Created second demo application:")
  console.log(`   Business: ${application2.businessName}`)
  console.log(`   Status: ${application2.status}`)
  console.log(`   ID: ${application2.id}`)

  console.log("\n🎉 Managed Sale demo seeding complete!")
  console.log(`\nView the dashboard at: /seller/managed-sale`)
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

