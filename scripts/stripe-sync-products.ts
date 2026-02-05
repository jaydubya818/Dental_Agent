/**
 * Stripe Product Sync Script
 * 
 * Creates/updates Stripe products and prices for SellerFi plans.
 * Run with: npx ts-node scripts/stripe-sync-products.ts
 * 
 * Set STRIPE_SECRET_KEY in .env before running.
 */

import Stripe from 'stripe'
import { SELLER_PLANS, BUYER_PLANS } from '../lib/stripe-products'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

async function syncProducts() {
  console.log('🔄 Starting Stripe product sync...\n')

  try {
    // Sync Seller Plans
    console.log('📦 Creating Seller Plans:')
    
    for (const [key, plan] of Object.entries(SELLER_PLANS)) {
      console.log(`\n  Creating: ${plan.name}`)
      
      // Create product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          type: 'seller_plan',
          plan_id: plan.id,
        },
      })
      
      console.log(`  ✓ Product created: ${product.id}`)
      
      // Create monthly price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.basePrice,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        metadata: {
          plan_id: plan.id,
          term: 'monthly',
        },
      })
      
      console.log(`  ✓ Price created: ${price.id}`)
      console.log(`\n  Add to .env:`)
      console.log(`  STRIPE_PRODUCT_SELLER_${key}=${product.id}`)
      console.log(`  STRIPE_PRICE_${key}_MONTHLY=${price.id}`)
    }

    // Sync Buyer Plans
    console.log('\n\n📦 Creating Buyer Plans:')
    
    // Buyer Pro
    const buyerProPlan = BUYER_PLANS.PRO
    const buyerProduct = await stripe.products.create({
      name: buyerProPlan.name,
      description: buyerProPlan.description,
      metadata: {
        type: 'buyer_plan',
        plan_id: buyerProPlan.id,
      },
    })
    
    console.log(`  ✓ Product created: ${buyerProduct.id}`)
    
    const buyerPrice = await stripe.prices.create({
      product: buyerProduct.id,
      unit_amount: buyerProPlan.basePrice,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan_id: buyerProPlan.id,
      },
    })
    
    console.log(`  ✓ Price created: ${buyerPrice.id}`)
    console.log(`\n  Add to .env:`)
    console.log(`  STRIPE_PRODUCT_BUYER_PRO=${buyerProduct.id}`)
    console.log(`  STRIPE_PRICE_BUYER_PRO_MONTHLY=${buyerPrice.id}`)

    // Elite Buyer
    console.log('\n\n📦 Creating Elite Buyer Plan:')
    const eliteBuyerPlan = BUYER_PLANS.ELITE
    const eliteProduct = await stripe.products.create({
      name: eliteBuyerPlan.name,
      description: eliteBuyerPlan.description,
      metadata: {
        type: 'buyer_plan',
        plan_id: eliteBuyerPlan.id,
      },
    })
    
    console.log(`  ✓ Product created: ${eliteProduct.id}`)
    
    const elitePrice = await stripe.prices.create({
      product: eliteProduct.id,
      unit_amount: eliteBuyerPlan.basePrice,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan_id: eliteBuyerPlan.id,
      },
    })
    
    console.log(`  ✓ Price created: ${elitePrice.id}`)
    console.log(`\n  Add to .env:`)
    console.log(`  STRIPE_PRODUCT_BUYER_ELITE=${eliteProduct.id}`)
    console.log(`  STRIPE_PRICE_BUYER_ELITE_MONTHLY=${elitePrice.id}`)

    console.log('\n\n✅ Sync complete!')
    console.log('\n⚠️  TODO: Copy the env vars above to your .env file')
    console.log('⚠️  TODO: Create 3-month and 6-month prices manually in Stripe Dashboard')
  } catch (error: any) {
    console.error('\n❌ Error syncing products:', error.message)
    process.exit(1)
  }
}

syncProducts()
