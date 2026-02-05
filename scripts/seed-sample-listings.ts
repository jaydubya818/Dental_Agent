import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// Helper to determine revenue bucket
function getRevenueBucket(revenue: number): string {
  if (revenue < 100000) return "UNDER_100K"
  if (revenue < 250000) return "FROM_100K_TO_250K"
  if (revenue < 500000) return "FROM_250K_TO_500K"
  if (revenue < 1000000) return "FROM_500K_TO_1M"
  if (revenue < 2000000) return "FROM_1M_TO_2M"
  if (revenue < 5000000) return "FROM_2M_TO_5M"
  return "ABOVE_5M"
}

// Helper to determine cashflow bucket
function getCashflowBucket(cashflow: number): string {
  if (cashflow < 0) return "NEGATIVE"
  if (cashflow < 50000) return "UNDER_50K"
  if (cashflow < 150000) return "FROM_50K_TO_150K"
  if (cashflow < 300000) return "FROM_150K_TO_300K"
  if (cashflow < 500000) return "FROM_300K_TO_500K"
  return "ABOVE_500K"
}

// Helper to parse location string into city and state
function parseLocation(location: string): { city: string; state: string } {
  const parts = location.split(", ")
  return {
    city: parts[0] || "",
    state: parts[1] || "",
  }
}

async function main() {
  console.log("🌱 Creating sample listings...")

  // Create example seller
  const passwordHash = await bcrypt.hash("sample-seller-password", 10)
  const seller = await prisma.user.upsert({
    where: { email: "sample-seller@sellerfin.com" },
    update: {},
    create: {
      firstName: "Sample",
      lastName: "Seller",
      email: "sample-seller@sellerfin.com",
      passwordHash,
      role: "SELLER",
      isActive: true,
    },
  })

  console.log(`✅ Created/updated seller: ${seller.email}`)

  const listingsData = [
    // 1 — SaaS (absentee) - Premium, High DSCR
    {
      title: "Subscription SaaS Platform",
      publicLabel: "Profitable SaaS Business with Recurring Revenue",
      teaserSummary: "Recurring subscription business with automated onboarding. Absentee owner-friendly with strong margins and predictable cash flow. Ideal for passive income seekers.",
      description: "Well-established SaaS platform serving 500+ active subscribers. Automated billing and customer onboarding. Owner has been absentee for 2+ years. Strong unit economics with 85% gross margins. Minimal support required.",
      location: "Austin, TX",
      assetType: "BUSINESS" as const,
      industry: "Software",
      price: 1200000,
      revenue: 900000,
      cashflow: 480000, // SDE
      financing: {
        downPayment: 300000,
        bankPortion: 700000,
        sellerPortion: 200000,
        sellerRate: 8.0,
        sellerYears: 7,
        bankRate: 6.5,
        bankYears: 10,
      },
      isPremium: true,
      isFeatured: false,
    },
    // 2 — HVAC Service Business - Good DSCR
    {
      title: "Residential HVAC Business",
      publicLabel: "Established HVAC Service Company",
      teaserSummary: "High repeat clientele with strong service contracts. Requires technical owner involvement but offers excellent growth potential.",
      description: "15-year-old HVAC business with 200+ recurring maintenance contracts. Strong reputation in Phoenix metro area. Owner retiring. Requires HVAC license to operate. Equipment and vehicles included.",
      location: "Phoenix, AZ",
      assetType: "BUSINESS" as const,
      industry: "Home Services",
      price: 900000,
      revenue: 1500000,
      cashflow: 300000, // SDE
      financing: {
        downPayment: 250000,
        bankPortion: 550000,
        sellerPortion: 100000,
        sellerRate: 9.0,
        sellerYears: 6,
        bankRate: 7.0,
        bankYears: 7,
      },
      isPremium: false,
      isFeatured: false,
    },
    // 3 — Cafe (risky) - Low DSCR
    {
      title: "Neighborhood Cafe & Bakery",
      publicLabel: "Popular Local Cafe with Strong Community Following",
      teaserSummary: "Great local following but thin margins and high staff costs. Requires hands-on owner with food service experience.",
      description: "Charming neighborhood cafe with loyal customer base. Strong weekend traffic. Located in high-foot-traffic area. Requires owner-operator. Staff of 8. Lease includes equipment.",
      location: "San Jose, CA",
      assetType: "BUSINESS" as const,
      industry: "Food & Beverage",
      price: 250000,
      revenue: 420000,
      cashflow: 85000, // SDE
      financing: {
        downPayment: 100000,
        bankPortion: 0,
        sellerPortion: 150000,
        sellerRate: 10.5,
        sellerYears: 5,
      },
      isPremium: false,
      isFeatured: false,
    },
    // 4 — Ecommerce value opportunity - Premium, Good Multiple
    {
      title: "E-Commerce Niche Retailer",
      publicLabel: "Profitable E-Commerce Brand with Strong Margins",
      teaserSummary: "Profitable niche brand with strong margins and loyal audience. Fully remote operation with minimal overhead.",
      description: "E-commerce business selling specialty products to niche market. 5-year track record of profitability. Fully automated fulfillment. Strong brand presence. Owner relocating.",
      location: "Miami, FL",
      assetType: "BUSINESS" as const,
      industry: "E-Commerce",
      price: 400000,
      revenue: 850000,
      cashflow: 200000, // SDE
      financing: {
        downPayment: 80000,
        bankPortion: 0,
        sellerPortion: 320000,
        sellerRate: 9.5,
        sellerYears: 7,
      },
      isPremium: true,
      isFeatured: false,
    },
    // 5 — Small Gym (low DSCR) - Risky
    {
      title: "Local Gym + Classes",
      publicLabel: "Growing Fitness Center with Membership Base",
      teaserSummary: "Growing memberships but fixed costs remain high. Requires fitness industry experience and active management.",
      description: "3-year-old fitness center with 150 active members. Offers group classes and personal training. Equipment included. Lease has 5 years remaining. Owner pursuing other opportunities.",
      location: "Las Vegas, NV",
      assetType: "BUSINESS" as const,
      industry: "Fitness",
      price: 150000,
      revenue: 260000,
      cashflow: 65000, // SDE
      financing: {
        downPayment: 50000,
        bankPortion: 0,
        sellerPortion: 100000,
        sellerRate: 11.0,
        sellerYears: 4,
      },
      isPremium: false,
      isFeatured: false,
    },
    // 6 — Specialty Manufacturing (blended) - Large deal
    {
      title: "Industrial Components Manufacturer",
      publicLabel: "Established Manufacturing Business with SBA Pre-Qualification",
      teaserSummary: "Owner retiring. SBA pre-qualified and strong operations. Requires manufacturing experience.",
      description: "25-year-old manufacturing business producing industrial components. Strong customer relationships with Fortune 500 companies. SBA loan pre-qualified. Owner retiring after successful exit. Equipment and real estate included.",
      location: "Columbus, OH",
      assetType: "BUSINESS" as const,
      industry: "Manufacturing",
      price: 3000000,
      revenue: 5000000,
      cashflow: 900000, // EBITDA
      financing: {
        downPayment: 600000,
        bankPortion: 2000000,
        sellerPortion: 400000,
        sellerRate: 7.5,
        sellerYears: 10,
        bankRate: 6.0,
        bankYears: 10,
        sbaEligible: true,
      },
      isPremium: false,
      isFeatured: true,
    },
  ]

  for (const data of listingsData) {
    const { city, state } = parseLocation(data.location)
    const revenueBucket = getRevenueBucket(data.revenue)
    const cashflowBucket = getCashflowBucket(data.cashflow)

    // Check if listing already exists (by publicLabel and seller)
    const existing = await prisma.listing.findFirst({
      where: {
        sellerId: seller.id,
        publicLabel: data.publicLabel,
      },
    })

    if (existing) {
      console.log(`⏭️  Skipping existing listing: ${data.publicLabel}`)
      continue
    }

    // Calculate percentages
    const downPaymentPercent = (data.financing.downPayment / data.price) * 100
    const sellerCarryPercent = (data.financing.sellerPortion / data.price) * 100
    const bankPercent = data.financing.bankPortion > 0 ? (data.financing.bankPortion / data.price) * 100 : null

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        publicLabel: data.publicLabel,
        teaserSummary: data.teaserSummary,
        description: data.description,
        assetType: data.assetType,
        industry: data.industry,
        status: "ACTIVE",
        sellerId: seller.id,
        city,
        state,
        country: "US",
        isPremium: data.isPremium,
        isFeatured: data.isFeatured,
        publishedAt: new Date(),
        viewCount: Math.floor(Math.random() * 50) + 10, // Random views between 10-60
        inquiryCount: Math.floor(Math.random() * 10), // Random inquiries 0-9
        financials: {
          create: {
            askingPrice: data.price,
            annualRevenue: data.revenue,
            sde: data.cashflow,
            ebitda: data.cashflow, // Using same value for simplicity
            revenueBucket: revenueBucket as any,
            cashflowBucket: cashflowBucket as any,
          },
        },
        financingTerms: {
          create: {
            downPaymentAmount: data.financing.downPayment,
            downPaymentPercent: Math.round(downPaymentPercent * 10) / 10,
            sellerCarryAmount: data.financing.sellerPortion,
            sellerCarryPercent: Math.round(sellerCarryPercent * 10) / 10,
            sellerCarryRate: data.financing.sellerRate,
            sellerCarryYears: data.financing.sellerYears,
            bankPortionAmount: data.financing.bankPortion > 0 ? data.financing.bankPortion : null,
            bankPortionPercent: bankPercent ? Math.round(bankPercent * 10) / 10 : null,
            bankRate: data.financing.bankRate || null,
            bankYears: data.financing.bankYears || null,
            sbaEligible: data.financing.sbaEligible || false,
          },
        },
      },
    })

    console.log(`✅ Created listing: ${listing.publicLabel || listing.title}`)
  }

  console.log("\n🎉 Sample listings created successfully!")
  console.log(`\n📊 Summary:`)
  console.log(`   - ${listingsData.length} listings created`)
  console.log(`   - ${listingsData.filter(l => l.isPremium).length} premium listings`)
  console.log(`   - ${listingsData.filter(l => l.isFeatured).length} featured listings`)
  console.log(`   - Seller: ${seller.email}`)
  console.log(`\n💡 Next steps:`)
  console.log(`   - View listings at: http://localhost:3000/listings`)
  console.log(`   - Or use Prisma Studio: npx prisma studio`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding listings:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

