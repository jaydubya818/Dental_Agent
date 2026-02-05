/**
 * Test Email Templates
 * 
 * Generates sample emails to verify template rendering
 * Run with: npx tsx scripts/test-email-templates.ts
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { unifiedEmailTemplate, generatePlainText, EmailTemplateOptions } from '../lib/email/templates'

console.log('🧪 Testing Email Templates\n')

// Create output directory
const outputDir = join(process.cwd(), 'test-emails')
try {
  require('fs').mkdirSync(outputDir, { recursive: true })
} catch (e) {
  // Directory already exists
}

// Test 1: Profile Reminder Email
console.log('1️⃣  Generating Profile Reminder Email...')
const profileReminderOptions: EmailTemplateOptions = {
  preheader: 'Your profile is 35% complete. Finish it to unlock exclusive deals!',
  title: 'John, Complete Your Profile to Access Exclusive Deals',
  recipientRole: 'BUYER',
  content: `
    <p>Hi John,</p>
    <p>Welcome to SellerFi! We noticed your profile is <strong>35% complete</strong>.</p>
    <p>Completing your profile unlocks:</p>
    <ul>
      <li><strong>Access to confidential listings</strong> with full financial details</li>
      <li><strong>Direct messaging</strong> with sellers</li>
      <li><strong>Priority consideration</strong> for high-quality deals</li>
    </ul>
  `,
  cta: {
    label: 'Complete My Profile',
    url: 'http://localhost:3000/profile/edit'
  },
  nextSteps: [
    'Add your Phone Number, Business Experience, Proof of Funds',
    'Verify your identity to build trust with sellers',
    'Set your deal preferences to get matched'
  ]
}
const profileReminder = unifiedEmailTemplate(profileReminderOptions)
writeFileSync(join(outputDir, '1-profile-reminder.html'), profileReminder)
console.log('   ✅ Saved to test-emails/1-profile-reminder.html')

// Test 2: Buyer Weekly Digest
console.log('2️⃣  Generating Buyer Weekly Digest...')
const buyerDigest = generateBuyerWeeklyDigestEmail({
  buyerName: 'John Smith',
  buyerEmail: 'john@example.com',
  newListings: [
    {
      id: '1',
      title: 'Profitable E-commerce Business',
      price: 450000,
      industry: 'E-commerce',
      location: 'Austin, TX'
    },
    {
      id: '2',
      title: 'Established Restaurant Chain',
      price: 1200000,
      industry: 'Food & Beverage',
      location: 'Miami, FL'
    },
    {
      id: '3',
      title: 'SaaS Platform with Recurring Revenue',
      price: 850000,
      industry: 'Technology',
      location: 'San Francisco, CA'
    }
  ],
  priceDrops: [
    {
      id: '4',
      title: 'Manufacturing Business',
      oldPrice: 600000,
      newPrice: 525000,
      savingsPercent: 12
    },
    {
      id: '5',
      title: 'Consulting Firm',
      oldPrice: 350000,
      newPrice: 295000,
      savingsPercent: 16
    }
  ],
  savedSearches: 3
})
writeFileSync(join(outputDir, '2-buyer-digest.html'), buyerDigest.html)
console.log('   ✅ Saved to test-emails/2-buyer-digest.html')

// Test 3: Draft Reminder Email
console.log('3️⃣  Generating Draft Reminder Email...')
const draftReminder = generateDraftReminderEmail({
  sellerName: 'Sarah Johnson',
  sellerEmail: 'sarah@example.com',
  listingTitle: 'Boutique Coffee Shop',
  listingId: 'listing-123',
  daysInDraft: 10,
  completenessPercent: 75,
  missingFields: ['Financial Statements', 'Lease Details']
})
writeFileSync(join(outputDir, '3-draft-reminder.html'), draftReminder.html)
console.log('   ✅ Saved to test-emails/3-draft-reminder.html')

// Test 4: Seller Weekly Digest
console.log('4️⃣  Generating Seller Weekly Digest...')
const sellerDigest = generateSellerWeeklyDigestEmail({
  sellerName: 'Sarah Johnson',
  sellerEmail: 'sarah@example.com',
  listings: [
    {
      id: '1',
      title: 'Boutique Coffee Shop',
      views: 127,
      inquiries: 8,
      messages: 12
    },
    {
      id: '2',
      title: 'Online Retail Store',
      views: 89,
      inquiries: 5,
      messages: 7
    }
  ],
  totalViews: 216,
  totalInquiries: 13
})
writeFileSync(join(outputDir, '4-seller-digest.html'), sellerDigest.html)
console.log('   ✅ Saved to test-emails/4-seller-digest.html')

// Test 5: Dealroom Inactivity Email (Buyer)
console.log('5️⃣  Generating Dealroom Inactivity Email (Buyer)...')
const inactivityBuyer = generateDealroomInactivityEmail({
  recipientName: 'John Smith',
  recipientEmail: 'john@example.com',
  recipientRole: 'BUYER',
  otherPartyName: 'Sarah Johnson',
  listingTitle: 'Boutique Coffee Shop',
  dealroomId: 'dealroom-456',
  daysSinceLastActivity: 9,
  lastActivityType: 'Seller shared financial documents'
})
writeFileSync(join(outputDir, '5-inactivity-buyer.html'), inactivityBuyer.html)
console.log('   ✅ Saved to test-emails/5-inactivity-buyer.html')

// Test 6: Dealroom Inactivity Email (Seller)
console.log('6️⃣  Generating Dealroom Inactivity Email (Seller)...')
const inactivitySeller = generateDealroomInactivityEmail({
  recipientName: 'Sarah Johnson',
  recipientEmail: 'sarah@example.com',
  recipientRole: 'SELLER',
  otherPartyName: 'John Smith',
  listingTitle: 'Boutique Coffee Shop',
  dealroomId: 'dealroom-456',
  daysSinceLastActivity: 9,
  lastActivityType: 'Buyer requested site visit'
})
writeFileSync(join(outputDir, '6-inactivity-seller.html'), inactivitySeller.html)
console.log('   ✅ Saved to test-emails/6-inactivity-seller.html')

console.log('\n✨ All email templates generated successfully!')
console.log(`📁 Open test-emails/ directory to view the HTML files in your browser\n`)
console.log('💡 Tip: Open these files in different email clients to test rendering:')
console.log('   - Gmail (web)')
console.log('   - Outlook (web)')
console.log('   - Apple Mail')
console.log('   - Mobile email apps\n')
