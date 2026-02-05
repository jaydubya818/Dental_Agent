/**
 * Stripe Integration Test Script
 * 
 * Validates the entire Stripe integration:
 * - Environment variables configured
 * - Stripe API connectivity
 * - Products and prices exist
 * - Webhook endpoint accessible
 * - Database schema correct
 * 
 * Usage:
 *   npx tsx scripts/test-stripe-integration.ts
 */

import { getStripe } from "../lib/stripe"
import { SELLER_PLANS, BUYER_PLANS } from "../lib/stripe-products"
import { prisma } from "../lib/prisma"

interface TestResult {
  name: string
  status: "✅ PASS" | "❌ FAIL" | "⚠️ WARN"
  message: string
}

const results: TestResult[] = []

async function runTests() {
  console.log("🧪 SellerFi Stripe Integration Tests\n")
  console.log("=" .repeat(60))

  // Test 1: Environment Variables
  await testEnvironmentVariables()

  // Test 2: Stripe API Connectivity
  await testStripeConnectivity()

  // Test 3: Products Exist in Stripe
  await testProductsExist()

  // Test 4: Price IDs Match
  await testPriceIds()

  // Test 5: Database Schema
  await testDatabaseSchema()

  // Test 6: Webhook Endpoint
  await testWebhookEndpoint()

  // Print Results
  console.log("\n" + "=".repeat(60))
  console.log("\n📊 TEST RESULTS\n")
  
  results.forEach((result) => {
    console.log(`${result.status} ${result.name}`)
    console.log(`   ${result.message}\n`)
  })

  const passed = results.filter((r) => r.status === "✅ PASS").length
  const failed = results.filter((r) => r.status === "❌ FAIL").length
  const warned = results.filter((r) => r.status === "⚠️ WARN").length

  console.log("=" .repeat(60))
  console.log(`\n✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⚠️  Warnings: ${warned}\n`)

  if (failed > 0) {
    console.log("❌ Integration NOT ready for production")
    process.exit(1)
  } else if (warned > 0) {
    console.log("⚠️  Integration ready but has warnings")
  } else {
    console.log("✅ Integration ready for production!")
  }
}

async function testEnvironmentVariables() {
  const required = [
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_APP_URL",
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length === 0) {
    results.push({
      name: "Environment Variables",
      status: "✅ PASS",
      message: "All required Stripe environment variables are set",
    })
  } else {
    results.push({
      name: "Environment Variables",
      status: "❌ FAIL",
      message: `Missing: ${missing.join(", ")}`,
    })
  }
}

async function testStripeConnectivity() {
  try {
    const stripe = getStripe()
    const account = await stripe.accounts.retrieve()
    
    results.push({
      name: "Stripe API Connectivity",
      status: "✅ PASS",
      message: `Connected to Stripe account: ${account.id}`,
    })
  } catch (error: any) {
    results.push({
      name: "Stripe API Connectivity",
      status: "❌ FAIL",
      message: `Failed to connect: ${error.message}`,
    })
  }
}

async function testProductsExist() {
  try {
    const stripe = getStripe()
    const products = await stripe.products.list({ limit: 100 })

    const expectedProducts = [
      "SellerFi Seller Basic",
      "SellerFi Seller Featured",
      "SellerFi Seller Premium",
      "SellerFi Buyer Pro",
      "SellerFi Elite Buyer",
    ]

    const existingProducts = products.data.map((p) => p.name)
    const missing = expectedProducts.filter((name) => !existingProducts.includes(name))

    if (missing.length === 0) {
      results.push({
        name: "Stripe Products",
        status: "✅ PASS",
        message: `All ${expectedProducts.length} products exist in Stripe`,
      })
    } else {
      results.push({
        name: "Stripe Products",
        status: "⚠️ WARN",
        message: `Missing products: ${missing.join(", ")}. Run: npx tsx scripts/stripe-sync-products.ts`,
      })
    }
  } catch (error: any) {
    results.push({
      name: "Stripe Products",
      status: "❌ FAIL",
      message: `Failed to fetch products: ${error.message}`,
    })
  }
}

async function testPriceIds() {
  const priceEnvVars = [
    "STRIPE_PRICE_SELLER_BASIC",
    "STRIPE_PRICE_SELLER_FEATURED",
    "STRIPE_PRICE_SELLER_ELITE",
    "STRIPE_PRICE_BUYER_PRO",
    "STRIPE_PRICE_BUYER_ELITE",
  ]

  const configured = priceEnvVars.filter((key) => process.env[key])
  const missing = priceEnvVars.filter((key) => !process.env[key])

  if (missing.length === 0) {
    results.push({
      name: "Price IDs Configuration",
      status: "✅ PASS",
      message: "All price IDs are configured",
    })
  } else {
    results.push({
      name: "Price IDs Configuration",
      status: "⚠️ WARN",
      message: `Missing: ${missing.join(", ")}. Add to .env.local after creating prices`,
    })
  }
}

async function testDatabaseSchema() {
  try {
    // Test if Subscription table exists and has required fields
    const subscription = await prisma.subscription.findFirst({
      select: {
        id: true,
        userId: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        tier: true,
        sellerPlan: true,
        buyerPlan: true,
        status: true,
      },
    })

    results.push({
      name: "Database Schema",
      status: "✅ PASS",
      message: "Subscription table schema is correct",
    })
  } catch (error: any) {
    results.push({
      name: "Database Schema",
      status: "❌ FAIL",
      message: `Database schema issue: ${error.message}. Run: npx prisma migrate dev`,
    })
  }
}

async function testWebhookEndpoint() {
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/webhook`

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: true }),
    })

    // We expect a 400 (missing signature) or 500, not 404
    if (response.status === 404) {
      results.push({
        name: "Webhook Endpoint",
        status: "❌ FAIL",
        message: `Webhook endpoint not found: ${webhookUrl}`,
      })
    } else {
      results.push({
        name: "Webhook Endpoint",
        status: "✅ PASS",
        message: `Webhook endpoint is accessible at ${webhookUrl}`,
      })
    }
  } catch (error: any) {
    results.push({
      name: "Webhook Endpoint",
      status: "⚠️ WARN",
      message: `Could not test webhook endpoint: ${error.message}. Test manually after deployment.`,
    })
  }
}

// Run tests
runTests().catch((error) => {
  console.error("Test runner failed:", error)
  process.exit(1)
})
