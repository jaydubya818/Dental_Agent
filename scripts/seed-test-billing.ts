/**
 * Seed Test Billing Data
 * Creates fictitious subscriptions and payments for testing admin pages
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test billing data...\n');

  // Get or create test users
  const testUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.buyer@test.com' },
      update: {},
      create: {
        email: 'john.buyer@test.com',
        passwordHash: '$2a$10$test',
        firstName: 'John',
        lastName: 'Buyer',
        role: 'BUYER',
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah.seller@test.com' },
      update: {},
      create: {
        email: 'sarah.seller@test.com',
        passwordHash: '$2a$10$test',
        firstName: 'Sarah',
        lastName: 'Seller',
        role: 'SELLER',
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike.broker@test.com' },
      update: {},
      create: {
        email: 'mike.broker@test.com',
        passwordHash: '$2a$10$test',
        firstName: 'Mike',
        lastName: 'Broker',
        role: 'BROKER',
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'elite.investor@test.com' },
      update: {},
      create: {
        email: 'elite.investor@test.com',
        passwordHash: '$2a$10$test',
        firstName: 'Emma',
        lastName: 'Elite',
        role: 'BUYER',
        emailVerified: true,
        isEliteBuyer: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'trial.user@test.com' },
      update: {},
      create: {
        email: 'trial.user@test.com',
        passwordHash: '$2a$10$test',
        firstName: 'Trial',
        lastName: 'User',
        role: 'BUYER',
        emailVerified: true,
      },
    }),
  ]);

  console.log(`✅ Created/updated ${testUsers.length} test users`);

  // Create subscriptions
  const now = new Date();
  const periodStart = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 days ago
  const periodEnd = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days from now
  const pastDueEnd = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago (past due)

  const subscriptions = [
    {
      userId: testUsers[0].id, // John Buyer - PRO
      tier: 'PRO',
      status: 'ACTIVE',
      type: 'PRO_BUYER',
      stripeCustomerId: 'cus_test_buyer_pro_001',
      stripeSubscriptionId: 'sub_test_buyer_pro_001',
      stripePriceId: 'price_test_pro_monthly',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      maxListings: 10,
      maxFeaturedDays: 30,
      buyerPlan: 'PRO',
      sellerPlan: 'NONE',
    },
    {
      userId: testUsers[1].id, // Sarah Seller - PRO
      tier: 'PRO',
      status: 'ACTIVE',
      type: 'PRO_SELLER',
      stripeCustomerId: 'cus_test_seller_pro_001',
      stripeSubscriptionId: 'sub_test_seller_pro_001',
      stripePriceId: 'price_test_pro_monthly',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      maxListings: 5,
      maxFeaturedDays: 60,
      buyerPlan: 'FREE',
      sellerPlan: 'FEATURED',
    },
    {
      userId: testUsers[3].id, // Emma Elite - ELITE
      tier: 'ENTERPRISE',
      status: 'ACTIVE',
      type: 'ELITE_INVESTOR',
      stripeCustomerId: 'cus_test_elite_001',
      stripeSubscriptionId: 'sub_test_elite_001',
      stripePriceId: 'price_test_elite_annual',
      currentPeriodStart: periodStart,
      currentPeriodEnd: new Date(now.getTime() + 350 * 24 * 60 * 60 * 1000), // Annual
      cancelAtPeriodEnd: false,
      maxListings: 999,
      maxFeaturedDays: 365,
      buyerPlan: 'PRO', // BuyerPlan only has FREE and PRO
      sellerPlan: 'ELITE',
    },
    {
      userId: testUsers[4].id, // Trial User
      tier: 'BASIC',
      status: 'TRIALING',
      type: null,
      stripeCustomerId: 'cus_test_trial_001',
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodStart: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000), // 14 day trial
      cancelAtPeriodEnd: false,
      maxListings: 1,
      maxFeaturedDays: 0,
      buyerPlan: 'FREE',
      sellerPlan: 'NONE',
    },
  ];

  for (const sub of subscriptions) {
    await prisma.subscription.upsert({
      where: { userId: sub.userId },
      update: sub,
      create: sub as any,
    });
  }

  console.log(`✅ Created/updated ${subscriptions.length} subscriptions`);

  // Create payment history
  const payments = [
    // John Buyer - Monthly payments
    {
      userId: testUsers[0].id,
      stripePaymentIntentId: 'pi_test_001',
      stripeInvoiceId: 'in_test_001',
      amount: 4900, // $49.00
      currency: 'usd',
      description: 'Pro Buyer Plan - Monthly',
      status: 'succeeded',
      metadata: { plan: 'PRO_BUYER', period: 'monthly' },
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      userId: testUsers[0].id,
      stripePaymentIntentId: 'pi_test_002',
      stripeInvoiceId: 'in_test_002',
      amount: 4900,
      currency: 'usd',
      description: 'Pro Buyer Plan - Monthly',
      status: 'succeeded',
      metadata: { plan: 'PRO_BUYER', period: 'monthly' },
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
    },
    // Sarah Seller - Monthly payments
    {
      userId: testUsers[1].id,
      stripePaymentIntentId: 'pi_test_003',
      stripeInvoiceId: 'in_test_003',
      amount: 7900, // $79.00
      currency: 'usd',
      description: 'Pro Seller Plan - Monthly',
      status: 'succeeded',
      metadata: { plan: 'PRO_SELLER', period: 'monthly' },
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      userId: testUsers[1].id,
      stripePaymentIntentId: 'pi_test_004',
      stripeInvoiceId: 'in_test_004',
      amount: 7900,
      currency: 'usd',
      description: 'Pro Seller Plan - Monthly',
      status: 'succeeded',
      metadata: { plan: 'PRO_SELLER', period: 'monthly' },
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
    },
    // Emma Elite - Annual payment
    {
      userId: testUsers[3].id,
      stripePaymentIntentId: 'pi_test_005',
      stripeInvoiceId: 'in_test_005',
      amount: 149900, // $1,499.00
      currency: 'usd',
      description: 'Elite Investor Plan - Annual',
      status: 'succeeded',
      metadata: { plan: 'ELITE_INVESTOR', period: 'annual' },
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    },
    // Failed payment
    {
      userId: testUsers[4].id,
      stripePaymentIntentId: 'pi_test_006_failed',
      stripeInvoiceId: 'in_test_006',
      amount: 2900, // $29.00
      currency: 'usd',
      description: 'Basic Plan - Monthly',
      status: 'failed',
      metadata: { plan: 'BASIC', period: 'monthly', error: 'insufficient_funds' },
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    // Refund
    {
      userId: testUsers[1].id,
      stripePaymentIntentId: 'pi_test_007_refund',
      stripeInvoiceId: 'in_test_007',
      amount: -7900, // Negative for refund
      currency: 'usd',
      description: 'Pro Seller Plan - Refund',
      status: 'refunded',
      metadata: { plan: 'PRO_SELLER', type: 'refund', original_payment: 'pi_test_003' },
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const payment of payments) {
    await prisma.paymentHistory.upsert({
      where: { stripePaymentIntentId: payment.stripePaymentIntentId! },
      update: payment,
      create: payment as any,
    });
  }

  console.log(`✅ Created/updated ${payments.length} payment history records`);

  // Create broker subscription for Mike
  await prisma.brokerSubscription.upsert({
    where: { brokerId: testUsers[2].id },
    update: {
      planTier: 'PROFESSIONAL',
      status: 'ACTIVE',
      stripeCustomerId: 'cus_test_broker_001',
      stripeSubscriptionId: 'sub_test_broker_001',
      stripePriceId: 'price_test_broker_pro',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      isAnnual: false,
    },
    create: {
      brokerId: testUsers[2].id,
      planTier: 'PROFESSIONAL',
      status: 'ACTIVE',
      stripeCustomerId: 'cus_test_broker_001',
      stripeSubscriptionId: 'sub_test_broker_001',
      stripePriceId: 'price_test_broker_pro',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      isAnnual: false,
      createdAt: periodStart,
      updatedAt: now,
    },
  });

  console.log('✅ Created/updated broker subscription');

  // Summary
  console.log('\n📊 Summary:');
  console.log('-------------------');
  const finalCounts = await Promise.all([
    prisma.subscription.count(),
    prisma.paymentHistory.count(),
    prisma.brokerSubscription.count(),
  ]);
  console.log(`Subscriptions: ${finalCounts[0]}`);
  console.log(`Payment History: ${finalCounts[1]}`);
  console.log(`Broker Subscriptions: ${finalCounts[2]}`);
  console.log('\n✅ Done! Visit:');
  console.log('   - http://localhost:3000/super-admin/subscriptions');
  console.log('   - http://localhost:3000/super-admin/payments');

  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
