/**
 * SellerFi Comprehensive Seed Script
 * 
 * Creates 20 realistic business listings across various industries
 * with proper financials, seller financing terms, and sample users.
 * 
 * Run with: npx ts-node scripts/seed-comprehensive.ts
 */

import { PrismaClient, AssetType, ListingStatus, UserRole, CashflowBucket, RevenueBucket } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// ============================================================================
// SAMPLE DATA
// ============================================================================

const INDUSTRIES = [
  { type: 'RESTAURANT' as AssetType, label: 'Restaurant & Food Service' },
  { type: 'RETAIL' as AssetType, label: 'Retail' },
  { type: 'SERVICE' as AssetType, label: 'Service Business' },
  { type: 'MANUFACTURING' as AssetType, label: 'Manufacturing' },
  { type: 'ECOMMERCE' as AssetType, label: 'E-commerce' },
  { type: 'HEALTHCARE' as AssetType, label: 'Healthcare' },
  { type: 'TECHNOLOGY' as AssetType, label: 'Technology / SaaS' },
  { type: 'FRANCHISE' as AssetType, label: 'Franchise' },
]

const STATES = ['TX', 'CA', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'AZ']

const CITIES: Record<string, string[]> = {
  TX: ['Austin', 'Dallas', 'Houston', 'San Antonio', 'Fort Worth'],
  CA: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
  FL: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
  NY: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
  IL: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'],
  PA: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
  OH: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
  GA: ['Atlanta', 'Augusta', 'Savannah', 'Athens', 'Macon'],
  NC: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
  AZ: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'],
}

// ============================================================================
// LISTING TEMPLATES
// ============================================================================

const LISTINGS = [
  // --- RESTAURANTS ---
  {
    title: 'Established Italian Restaurant with Loyal Customer Base',
    publicLabel: 'Italian Restaurant',
    assetType: 'RESTAURANT' as AssetType,
    description: `Well-established Italian restaurant operating for 15+ years in a prime downtown location. Features a full bar, private dining room, and outdoor patio seating for 40. Known for authentic family recipes and has won "Best Italian" awards for 5 consecutive years. Strong catering business contributes 25% of revenue. Fully trained staff of 22 employees willing to stay. Turn-key operation with modern kitchen equipment.`,
    teaserSummary: 'Award-winning Italian restaurant with 15-year track record, strong catering business, and loyal customer base.',
    askingPrice: 875000,
    annualRevenue: 1450000,
    sde: 285000,
    downPayment: 262500,
    sellerCarryAmount: 437500,
    sellerCarryRate: 6.5,
    sellerCarryYears: 7,
    employees: 22,
    reasonForSelling: 'Owner retiring after 15 years. Willing to assist with transition.',
    isPremium: true,
    isFeatured: true,
  },
  {
    title: 'Fast-Casual Healthy Bowl Concept - 3 Locations',
    publicLabel: 'Fast-Casual Restaurant Chain',
    assetType: 'RESTAURANT' as AssetType,
    description: `Growing fast-casual healthy bowl concept with 3 profitable locations. Modern, Instagram-worthy interiors attract health-conscious millennials. Strong delivery presence (40% of sales via apps). Proprietary recipes and established supplier relationships. Systemized operations with detailed SOPs. Expansion-ready with proven unit economics.`,
    teaserSummary: 'Multi-unit healthy fast-casual concept with 40% delivery sales and proven expansion model.',
    askingPrice: 1250000,
    annualRevenue: 2100000,
    sde: 380000,
    downPayment: 375000,
    sellerCarryAmount: 500000,
    sellerCarryRate: 7.0,
    sellerCarryYears: 5,
    employees: 35,
    reasonForSelling: 'Partners pursuing other ventures. Will provide 90-day transition support.',
    isPremium: true,
    isFeatured: false,
  },
  {
    title: 'Neighborhood Coffee Shop & Bakery',
    publicLabel: 'Coffee Shop',
    assetType: 'RESTAURANT' as AssetType,
    description: `Beloved neighborhood coffee shop and bakery in affluent suburb. In-house baking program with signature pastries. Loyal morning crowd of professionals. Low rent with 8 years remaining on lease. Simple operations suitable for owner-operator. Strong weekend brunch business.`,
    teaserSummary: 'Charming coffee shop with in-house bakery in affluent suburb. Owner-operator opportunity.',
    askingPrice: 225000,
    annualRevenue: 420000,
    sde: 85000,
    downPayment: 67500,
    sellerCarryAmount: 112500,
    sellerCarryRate: 6.0,
    sellerCarryYears: 5,
    employees: 8,
    reasonForSelling: 'Owner relocating for family reasons.',
    isPremium: false,
    isFeatured: false,
  },

  // --- E-COMMERCE ---
  {
    title: 'Profitable Amazon FBA Brand - Pet Products',
    publicLabel: 'E-commerce Pet Brand',
    assetType: 'ECOMMERCE' as AssetType,
    description: `Established Amazon FBA business specializing in premium pet products. 12 SKUs with average 4.5-star ratings. Strong brand recognition with 50,000+ reviews. Diversified supplier base in US and overseas. Includes trademarks, inventory, and supplier relationships. 65% repeat customer rate.`,
    teaserSummary: 'Top-rated Amazon FBA pet brand with 50K+ reviews and 65% repeat customer rate.',
    askingPrice: 650000,
    annualRevenue: 1200000,
    sde: 220000,
    downPayment: 195000,
    sellerCarryAmount: 260000,
    sellerCarryRate: 7.5,
    sellerCarryYears: 4,
    employees: 2,
    reasonForSelling: 'Seller focusing on larger brand portfolio.',
    isPremium: true,
    isFeatured: true,
  },
  {
    title: 'DTC Sustainable Fashion Brand',
    publicLabel: 'Fashion E-commerce',
    assetType: 'ECOMMERCE' as AssetType,
    description: `Direct-to-consumer sustainable fashion brand with strong social media presence (150K followers). Shopify-based with proven paid acquisition channels. Average order value of $120. 30-day CAC payback. Includes brand, website, email list (45K subscribers), and inventory.`,
    teaserSummary: 'Sustainable DTC fashion brand with 150K social followers and strong unit economics.',
    askingPrice: 480000,
    annualRevenue: 890000,
    sde: 165000,
    downPayment: 144000,
    sellerCarryAmount: 192000,
    sellerCarryRate: 7.0,
    sellerCarryYears: 4,
    employees: 3,
    reasonForSelling: 'Founder pursuing new venture in different industry.',
    isPremium: false,
    isFeatured: false,
  },

  // --- SAAS / TECHNOLOGY ---
  {
    title: 'B2B SaaS - Project Management for Contractors',
    publicLabel: 'SaaS Platform',
    assetType: 'TECHNOLOGY' as AssetType,
    description: `Profitable B2B SaaS platform serving 400+ contractor businesses. Solves project management, invoicing, and client communication. 92% gross margins. Net revenue retention of 115%. Low churn (3% monthly). Built on modern tech stack (React, Node.js, AWS). Includes codebase, customer base, and documentation.`,
    teaserSummary: 'Profitable B2B SaaS with 400+ customers, 92% margins, and 115% net revenue retention.',
    askingPrice: 1800000,
    annualRevenue: 720000,
    sde: 540000,
    downPayment: 540000,
    sellerCarryAmount: 720000,
    sellerCarryRate: 6.0,
    sellerCarryYears: 5,
    employees: 4,
    reasonForSelling: 'Founder joining larger company. Will provide technical transition support.',
    isPremium: true,
    isFeatured: true,
  },
  {
    title: 'Mobile App - Fitness & Wellness',
    publicLabel: 'Fitness App',
    assetType: 'TECHNOLOGY' as AssetType,
    description: `iOS and Android fitness app with 25,000 paid subscribers at $9.99/month. Featured by Apple multiple times. Strong organic growth through word-of-mouth. Clean codebase in Swift and Kotlin. Includes app, subscriber base, brand, and content library.`,
    teaserSummary: 'Apple-featured fitness app with 25K paid subscribers and strong organic growth.',
    askingPrice: 950000,
    annualRevenue: 2400000,
    sde: 320000,
    downPayment: 285000,
    sellerCarryAmount: 380000,
    sellerCarryRate: 6.5,
    sellerCarryYears: 4,
    employees: 2,
    reasonForSelling: 'Solo founder seeking work-life balance.',
    isPremium: false,
    isFeatured: false,
  },

  // --- MANUFACTURING ---
  {
    title: 'Custom Metal Fabrication Shop',
    publicLabel: 'Metal Fabrication',
    assetType: 'MANUFACTURING' as AssetType,
    description: `Established custom metal fabrication business serving commercial and industrial clients. CNC equipment valued at $400K included. Diversified customer base with no client over 15% of revenue. Long-term contracts with 3 major accounts. 15,000 sq ft facility with favorable lease.`,
    teaserSummary: 'Custom metal fab shop with $400K equipment, diversified clients, and long-term contracts.',
    askingPrice: 1100000,
    annualRevenue: 1850000,
    sde: 340000,
    downPayment: 330000,
    sellerCarryAmount: 440000,
    sellerCarryRate: 7.0,
    sellerCarryYears: 6,
    employees: 12,
    reasonForSelling: 'Owner health issues require stepping back.',
    isPremium: false,
    isFeatured: false,
  },
  {
    title: 'Specialty Food Manufacturing - Private Label',
    publicLabel: 'Food Manufacturing',
    assetType: 'MANUFACTURING' as AssetType,
    description: `USDA-certified specialty food manufacturing facility producing private label sauces and marinades. Serves 50+ retail and foodservice clients. SQF certified. Modern equipment and trained production team. Strong margins on proprietary formulations. Expansion capacity available.`,
    teaserSummary: 'USDA-certified private label food manufacturer with 50+ clients and expansion capacity.',
    askingPrice: 2200000,
    annualRevenue: 3400000,
    sde: 620000,
    downPayment: 660000,
    sellerCarryAmount: 880000,
    sellerCarryRate: 6.5,
    sellerCarryYears: 7,
    employees: 28,
    reasonForSelling: 'Founder retiring. Key management willing to stay.',
    isPremium: true,
    isFeatured: false,
  },

  // --- SERVICE BUSINESSES ---
  {
    title: 'Commercial Cleaning Company - Government Contracts',
    publicLabel: 'Commercial Cleaning',
    assetType: 'SERVICE' as AssetType,
    description: `Established commercial cleaning company with multiple government contracts. GSA schedule holder. Bonded and insured. Recurring revenue model with 95% retention. Trained workforce of 45 cleaners. Management team runs day-to-day operations.`,
    teaserSummary: 'Government-contracted commercial cleaning with GSA schedule and 95% retention.',
    askingPrice: 750000,
    annualRevenue: 1600000,
    sde: 280000,
    downPayment: 225000,
    sellerCarryAmount: 300000,
    sellerCarryRate: 6.5,
    sellerCarryYears: 5,
    employees: 45,
    reasonForSelling: 'Owner pursuing real estate investments.',
    isPremium: false,
    isFeatured: false,
  },
  {
    title: 'HVAC Service & Installation Company',
    publicLabel: 'HVAC Services',
    assetType: 'SERVICE' as AssetType,
    description: `Full-service HVAC company with 2,500+ residential service agreements generating predictable recurring revenue. Licensed and insured. Fleet of 8 service vehicles. Strong online reviews (4.8 stars, 500+ reviews). Technicians trained and certified.`,
    teaserSummary: 'HVAC company with 2,500+ service agreements and 4.8-star online reputation.',
    askingPrice: 1350000,
    annualRevenue: 2200000,
    sde: 420000,
    downPayment: 405000,
    sellerCarryAmount: 540000,
    sellerCarryRate: 6.0,
    sellerCarryYears: 6,
    employees: 18,
    reasonForSelling: 'Owner retiring after 20 years in business.',
    isPremium: true,
    isFeatured: false,
  },
  {
    title: 'Digital Marketing Agency - B2B Focus',
    publicLabel: 'Marketing Agency',
    assetType: 'SERVICE' as AssetType,
    description: `B2B digital marketing agency specializing in lead generation for professional services firms. 85% recurring retainer revenue. Average client tenure of 3+ years. Remote team model with low overhead. Strong case studies and testimonials.`,
    teaserSummary: 'B2B marketing agency with 85% recurring revenue and 3+ year average client tenure.',
    askingPrice: 520000,
    annualRevenue: 680000,
    sde: 195000,
    downPayment: 156000,
    sellerCarryAmount: 208000,
    sellerCarryRate: 7.0,
    sellerCarryYears: 4,
    employees: 6,
    reasonForSelling: 'Founder joining client company full-time.',
    isPremium: false,
    isFeatured: false,
  },

  // --- HEALTHCARE ---
  {
    title: 'Physical Therapy Practice - 2 Locations',
    publicLabel: 'Physical Therapy',
    assetType: 'HEALTHCARE' as AssetType,
    description: `Multi-location physical therapy practice with strong physician referral network. In-network with all major insurers. Modern facilities with specialized equipment. Experienced PTs willing to stay. EMR system and billing processes in place.`,
    teaserSummary: 'Two-location PT practice with strong referral network and in-network insurance.',
    askingPrice: 1450000,
    annualRevenue: 2100000,
    sde: 480000,
    downPayment: 435000,
    sellerCarryAmount: 580000,
    sellerCarryRate: 6.0,
    sellerCarryYears: 6,
    employees: 14,
    reasonForSelling: 'Owner relocating out of state.',
    isPremium: false,
    isFeatured: false,
  },
  {
    title: 'Home Health Care Agency',
    publicLabel: 'Home Health Care',
    assetType: 'HEALTHCARE' as AssetType,
    description: `Licensed home health care agency serving elderly and disabled clients. Medicare and Medicaid certified. 150+ active clients with high satisfaction scores. Trained caregiver workforce. Compliance systems and documentation in place.`,
    teaserSummary: 'Medicare/Medicaid certified home health agency with 150+ active clients.',
    askingPrice: 890000,
    annualRevenue: 1750000,
    sde: 310000,
    downPayment: 267000,
    sellerCarryAmount: 356000,
    sellerCarryRate: 6.5,
    sellerCarryYears: 5,
    employees: 65,
    reasonForSelling: 'Partnership dissolution - amicable.',
    isPremium: false,
    isFeatured: false,
  },

  // --- RETAIL ---
  {
    title: 'Specialty Pet Store with Grooming',
    publicLabel: 'Pet Store',
    assetType: 'RETAIL' as AssetType,
    description: `Neighborhood pet store with thriving grooming salon. Loyal customer base in affluent area. Grooming contributes 40% of revenue with higher margins. Established relationships with premium pet food brands. Modern POS and inventory management.`,
    teaserSummary: 'Neighborhood pet store with high-margin grooming salon in affluent area.',
    askingPrice: 385000,
    annualRevenue: 720000,
    sde: 125000,
    downPayment: 115500,
    sellerCarryAmount: 154000,
    sellerCarryRate: 6.5,
    sellerCarryYears: 5,
    employees: 9,
    reasonForSelling: 'Owner pursuing different career path.',
    isPremium: false,
    isFeatured: false,
  },
  {
    title: 'Established Liquor Store - Prime Location',
    publicLabel: 'Liquor Store',
    assetType: 'RETAIL' as AssetType,
    description: `High-volume liquor store in prime retail corridor. Rare liquor license included in sale. Strong selection of craft beers and premium spirits. Modern security and POS systems. Long-term lease with favorable terms. Lottery retailer.`,
    teaserSummary: 'High-volume liquor store with rare license in prime location. Lottery retailer.',
    askingPrice: 675000,
    annualRevenue: 1850000,
    sde: 225000,
    downPayment: 202500,
    sellerCarryAmount: 270000,
    sellerCarryRate: 7.0,
    sellerCarryYears: 5,
    employees: 6,
    reasonForSelling: 'Owner consolidating business interests.',
    isPremium: false,
    isFeatured: true,
  },

  // --- FRANCHISE ---
  {
    title: 'Multi-Unit Sandwich Franchise - 4 Locations',
    publicLabel: 'Sandwich Franchise',
    assetType: 'FRANCHISE' as AssetType,
    description: `Four profitable locations of nationally recognized sandwich franchise. All locations in strong trade areas. Experienced managers run day-to-day operations. Franchisor approval required. Training and support included. Royalty: 6%.`,
    teaserSummary: 'Four-unit sandwich franchise with experienced managers and absentee potential.',
    askingPrice: 1650000,
    annualRevenue: 2800000,
    sde: 520000,
    downPayment: 495000,
    sellerCarryAmount: 660000,
    sellerCarryRate: 6.5,
    sellerCarryYears: 6,
    employees: 42,
    reasonForSelling: 'Owner diversifying into different franchise brand.',
    isPremium: true,
    isFeatured: false,
  },
  {
    title: 'Fitness Franchise - Boutique Studio',
    publicLabel: 'Fitness Franchise',
    assetType: 'FRANCHISE' as AssetType,
    description: `Popular boutique fitness franchise location in growing suburban market. 450+ active members. Strong class attendance and retention. Franchisor provides marketing support. Modern equipment and facilities. Franchisor approval required.`,
    teaserSummary: 'Boutique fitness franchise with 450+ members in growing market.',
    askingPrice: 295000,
    annualRevenue: 480000,
    sde: 95000,
    downPayment: 88500,
    sellerCarryAmount: 118000,
    sellerCarryRate: 7.0,
    sellerCarryYears: 4,
    employees: 8,
    reasonForSelling: 'Owner relocating for spouse\'s job.',
    isPremium: false,
    isFeatured: false,
  },

  // --- MORE VARIETY ---
  {
    title: 'Auto Repair Shop - European Specialists',
    publicLabel: 'Auto Repair',
    assetType: 'SERVICE' as AssetType,
    description: `Specialized European auto repair shop serving BMW, Mercedes, Audi, and Porsche owners. ASE-certified technicians. Modern diagnostic equipment. Strong online reviews and word-of-mouth referrals. 5,000+ customer database.`,
    teaserSummary: 'European auto specialists with ASE-certified techs and 5,000+ customer database.',
    askingPrice: 550000,
    annualRevenue: 920000,
    sde: 185000,
    downPayment: 165000,
    sellerCarryAmount: 220000,
    sellerCarryRate: 6.5,
    sellerCarryYears: 5,
    employees: 7,
    reasonForSelling: 'Owner semi-retiring, willing to consult.',
    isPremium: false,
    isFeatured: false,
  },
  {
    title: 'Profitable Laundromat - Coin & Card Operated',
    publicLabel: 'Laundromat',
    assetType: 'SERVICE' as AssetType,
    description: `Modern laundromat with 45 machines accepting coins and cards. Wash-dry-fold service adds 30% to revenue. Unattended operation with remote monitoring. New equipment with warranties. Long-term lease. Semi-passive income opportunity.`,
    teaserSummary: 'Modern laundromat with wash-dry-fold service. Semi-passive income.',
    askingPrice: 425000,
    annualRevenue: 380000,
    sde: 140000,
    downPayment: 127500,
    sellerCarryAmount: 170000,
    sellerCarryRate: 6.0,
    sellerCarryYears: 5,
    employees: 3,
    reasonForSelling: 'Owner consolidating real estate portfolio.',
    isPremium: false,
    isFeatured: false,
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function calculateDSCR(sde: number, sellerCarryAmount: number, rate: number, years: number): number {
  const monthlyRate = rate / 100 / 12
  const numPayments = years * 12
  const monthlyPayment = sellerCarryAmount > 0 && monthlyRate > 0
    ? (sellerCarryAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0
  const annualDebtService = monthlyPayment * 12
  return annualDebtService > 0 ? sde / annualDebtService : 0
}

function getCashflowBucket(sde: number): CashflowBucket {
  if (sde < 0) return 'NEGATIVE'
  if (sde < 50000) return 'UNDER_50K'
  if (sde < 150000) return 'FROM_50K_TO_150K'
  if (sde < 300000) return 'FROM_150K_TO_300K'
  if (sde < 500000) return 'FROM_300K_TO_500K'
  return 'ABOVE_500K'
}

function getRevenueBucket(revenue: number): RevenueBucket {
  if (revenue < 100000) return 'UNDER_100K'
  if (revenue < 250000) return 'FROM_100K_TO_250K'
  if (revenue < 500000) return 'FROM_250K_TO_500K'
  if (revenue < 1000000) return 'FROM_500K_TO_1M'
  if (revenue < 2000000) return 'FROM_1M_TO_2M'
  if (revenue < 5000000) return 'FROM_2M_TO_5M'
  return 'ABOVE_5M'
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌱 Starting comprehensive seed...\n')

  // --- Create sample sellers ---
  console.log('Creating sample sellers...')
  
  const passwordHash = await hash('password123', 12)
  
  const sellers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'seller1@sellerfin.com' },
      update: {},
      create: {
        email: 'seller1@sellerfin.com',
        firstName: 'Michael',
        lastName: 'Johnson',
        passwordHash,
        role: 'SELLER' as UserRole,
      },
    }),
    prisma.user.upsert({
      where: { email: 'seller2@sellerfin.com' },
      update: {},
      create: {
        email: 'seller2@sellerfin.com',
        firstName: 'Sarah',
        lastName: 'Williams',
        passwordHash,
        role: 'SELLER' as UserRole,
      },
    }),
    prisma.user.upsert({
      where: { email: 'seller3@sellerfin.com' },
      update: {},
      create: {
        email: 'seller3@sellerfin.com',
        firstName: 'David',
        lastName: 'Chen',
        passwordHash,
        role: 'SELLER' as UserRole,
      },
    }),
    prisma.user.upsert({
      where: { email: 'seller4@sellerfin.com' },
      update: {},
      create: {
        email: 'seller4@sellerfin.com',
        firstName: 'Jennifer',
        lastName: 'Martinez',
        passwordHash,
        role: 'SELLER' as UserRole,
      },
    }),
  ])

  console.log(`✓ Created ${sellers.length} sellers\n`)

  // --- Create sample buyers ---
  console.log('Creating sample buyers...')
  
  const buyers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'buyer1@sellerfin.com' },
      update: {},
      create: {
        email: 'buyer1@sellerfin.com',
        firstName: 'Robert',
        lastName: 'Smith',
        passwordHash,
        role: 'BUYER' as UserRole,
      },
    }),
    prisma.user.upsert({
      where: { email: 'buyer2@sellerfin.com' },
      update: {},
      create: {
        email: 'buyer2@sellerfin.com',
        firstName: 'Emily',
        lastName: 'Davis',
        passwordHash,
        role: 'BUYER' as UserRole,
      },
    }),
  ])

  // Create buyer profiles
  for (const buyer of buyers) {
    await prisma.buyerProfile.upsert({
      where: { userId: buyer.id },
      update: {},
      create: {
        userId: buyer.id,
        liquidity: getRandomNumber(100000, 1000000),
        yearsExperience: getRandomNumber(2, 20),
        profileCompleteness: getRandomNumber(60, 100),
        canAccessNDA: true,
      },
    })
  }

  console.log(`✓ Created ${buyers.length} buyers with profiles\n`)

  // --- Create listings ---
  console.log('Creating listings...')
  
  for (let i = 0; i < LISTINGS.length; i++) {
    const listingData = LISTINGS[i]
    const seller = sellers[i % sellers.length]
    const state = getRandomElement(STATES)
    const city = getRandomElement(CITIES[state])
    
    // Calculate DSCR
    const dscr = calculateDSCR(
      listingData.sde,
      listingData.sellerCarryAmount,
      listingData.sellerCarryRate,
      listingData.sellerCarryYears
    )

    // Random engagement metrics
    const viewsLast7Days = getRandomNumber(5, 80)
    const viewsLast30Days = viewsLast7Days * 4 + getRandomNumber(0, 50)
    const inquiryCount = Math.floor(viewsLast30Days * (getRandomNumber(5, 20) / 100))
    const competitionScore = Math.min(100, Math.floor((viewsLast7Days * 0.8 + inquiryCount * 5)))

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: listingData.title,
        publicLabel: listingData.publicLabel,
        assetType: listingData.assetType,
        description: listingData.description,
        teaserSummary: listingData.teaserSummary,
        state,
        city,
        status: 'ACTIVE' as ListingStatus,
        isPremium: listingData.isPremium,
        isFeatured: listingData.isFeatured,
        viewsLast7Days,
        viewsLast30Days,
        inquiryCount,
        competitionScore,
        employeesCount: listingData.employees,
        reasonForSelling: listingData.reasonForSelling,
        showBusinessName: getRandomNumber(0, 1) === 1,
        locationVisibility: 'CITY_ONLY',
      },
    })

    // Create financials
    await prisma.listingFinancials.create({
      data: {
        listingId: listing.id,
        askingPrice: listingData.askingPrice,
        annualRevenue: listingData.annualRevenue,
        sde: listingData.sde,
        ebitda: Math.floor(listingData.sde * 0.85),
        revenueBucket: getRevenueBucket(listingData.annualRevenue),
        cashflowBucket: getCashflowBucket(listingData.sde),
      },
    })

    // Create financing terms
    await prisma.financingTerms.create({
      data: {
        listingId: listing.id,
        downPaymentAmount: listingData.downPayment,
        sellerCarryAmount: listingData.sellerCarryAmount,
        sellerCarryRate: listingData.sellerCarryRate,
        sellerCarryYears: listingData.sellerCarryYears,
      },
    })

    console.log(`  ✓ ${i + 1}/${LISTINGS.length}: ${listingData.title.substring(0, 50)}...`)
  }

  console.log(`\n✓ Created ${LISTINGS.length} listings with financials\n`)

  // --- Summary ---
  const listingCount = await prisma.listing.count()
  const userCount = await prisma.user.count()
  const financialsCount = await prisma.listingFinancials.count()

  console.log('═══════════════════════════════════════════════════════')
  console.log('                    SEED COMPLETE!')
  console.log('═══════════════════════════════════════════════════════')
  console.log(`  Users:      ${userCount}`)
  console.log(`  Listings:   ${listingCount}`)
  console.log(`  Financials: ${financialsCount}`)
  console.log('')
  console.log('  Sample Credentials:')
  console.log('  ─────────────────────────────────────────────────────')
  console.log('  Sellers:')
  console.log('    seller1@sellerfin.com / password123')
  console.log('    seller2@sellerfin.com / password123')
  console.log('')
  console.log('  Buyers:')
  console.log('    buyer1@sellerfin.com / password123')
  console.log('    buyer2@sellerfin.com / password123')
  console.log('═══════════════════════════════════════════════════════')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

