/**
 * Setup Stripe Products & Prices
 * 
 * Run this script to create all SellerFi subscription products in Stripe.
 * 
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/setup-stripe-products.ts
 * 
 * For production:
 *   STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/setup-stripe-products.ts --live
 */

import Stripe from 'stripe'

// Initialize Stripe
const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required')
  process.exit(1)
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

const isLive = process.argv.includes('--live')
const mode = isLive ? '🔴 LIVE' : '🟡 TEST'

console.log(`\n🚀 Setting up Stripe products in ${mode} mode\n`)

// Product definitions
const products = [
  {
    name: 'Seller Basic',
    description: 'Single business listing with essential features. Perfect for first-time sellers.',
    price: 1995, // $19.95
    interval: 'month' as const,
    features: [
      'List 1 business',
      'Basic listing features',
      'Email support',
      'Seller financing terms',
      'NDA-gated documents',
    ],
    metadata: {
      plan_type: 'seller',
      plan_id: 'basic',
      tier: 'BASIC',
    },
  },
  {
    name: 'Seller Featured',
    description: 'Featured placement + priority support. Stand out to serious buyers.',
    price: 3900, // $39
    interval: 'month' as const,
    features: [
      'List 1 business',
      'Featured placement in search',
      'Priority email support',
      'Advanced analytics',
      'Custom branding',
      'Seller dashboard',
    ],
    metadata: {
      plan_type: 'seller',
      plan_id: 'featured',
      tier: 'PRO',
    },
  },
  {
    name: 'Seller Premium',
    description: 'Multiple listings + advanced features. For portfolio sellers.',
    price: 5900, // $59
    interval: 'month' as const,
    features: [
      'List up to 3 businesses',
      'Featured placement',
      'Priority support (24h response)',
      'Advanced analytics dashboard',
      'Custom branding',
      'Dedicated account manager',
      'API access',
    ],
    metadata: {
      plan_type: 'seller',
      plan_id: 'premium',
      tier: 'ENTERPRISE',
    },
  },
  {
    name: 'Buyer Pro',
    description: 'Advanced search + saved searches. Find your perfect business faster.',
    price: 1900, // $19
    interval: 'month' as const,
    features: [
      'Advanced search filters',
      'Unlimited saved searches',
      'Email alerts for new matches',
      'Deal comparison tool',
      'Historical deal data',
    ],
    metadata: {
      plan_type: 'buyer',
      plan_id: 'pro',
      tier: 'PRO',
    },
  },
  {
    name: 'Buyer Elite',
    description: 'AI recommendations + priority access. Get deals before everyone else.',
    price: 7900, // $79
    interval: 'month' as const,
    features: [
      'All Pro features',
      'AI-powered deal recommendations',
      'Priority access to new listings',
      'Exclusive off-market deals',
      'Deal evaluation assistant',
      'Direct seller messaging',
      'Dedicated deal concierge',
    ],
    metadata: {
      plan_type: 'buyer',
      plan_id: 'elite',
      tier: 'ENTERPRISE',
    },
  },
]

async function createProduct(productData: typeof products[0]) {
  try {
    console.log(`Creating product: ${productData.name} ($${productData.price / 100}/${productData.interval})...`)
    
    // Create product
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      metadata: productData.metadata,
    })
    
    console.log(`  ✅ Product created: ${product.id}`)
    
    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productData.price,
      currency: 'usd',
      recurring: {
        interval: productData.interval,
      },
      metadata: productData.metadata,
    })
    
    console.log(`  ✅ Price created: ${price.id}`)
    console.log(`  💰 ${productData.name}: $${price.unit_amount! / 100}/${price.recurring?.interval}\n`)
    
    return {
      product,
      price,
      envVar: `STRIPE_PRICE_${productData.metadata.plan_type.toUpperCase()}_${productData.metadata.plan_id.toUpperCase()}`,
      priceId: price.id,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`  ❌ Error creating ${productData.name}:`, error.message)
    }
    throw error
  }
}

async function main() {
  console.log('📦 Creating products and prices...\n')
  
  const results = []
  
  for (const productData of products) {
    const result = await createProduct(productData)
    results.push(result)
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n✅ All products and prices created successfully!\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📝 Add these to your .env file:\n')
  
  results.forEach(({ envVar, priceId }) => {
    console.log(`${envVar}="${priceId}"`)
  })
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n🎉 Setup complete! You can now:\n')
  console.log('1. Copy the env vars above to your .env file')
  console.log('2. Restart your dev server')
  console.log('3. Test checkout flows at /pricing')
  console.log('4. Set up webhook endpoint in Stripe Dashboard')
  console.log('   URL: https://seller-fi.vercel.app/api/webhooks/stripe')
  console.log('   Events: checkout.session.completed, customer.subscription.*')
  console.log('')
}

main()
  .then(() => {
    console.log('✨ Done!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  })
