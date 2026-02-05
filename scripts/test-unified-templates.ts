/**
 * Test Unified Email Templates
 * 
 * Generates sample emails using the new unified template system
 * Run with: npx tsx scripts/test-unified-templates.ts
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { unifiedEmailTemplate, EmailTemplateOptions } from '../lib/email/templates'

console.log('🧪 Testing Unified Email Templates\n')

// Create output directory
const outputDir = join(process.cwd(), 'test-emails')
try {
  mkdirSync(outputDir, { recursive: true })
} catch (e) {
  // Directory already exists
}

// Test 1: Buyer Email (Blue theme)
console.log('1️⃣  Generating Buyer Profile Reminder...')
const buyerEmail: EmailTemplateOptions = {
  preheader: 'Complete your profile to unlock exclusive deals',
  title: 'Complete Your Profile to Access Exclusive Deals',
  recipientRole: 'BUYER',
  content: `
    <p>Hi John,</p>
    <p>Welcome to SellerFi! Your profile is <strong>35% complete</strong>.</p>
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
    'Add your contact information and business experience',
    'Verify your identity to build trust with sellers',
    'Set your deal preferences to get matched with opportunities'
  ]
}
writeFileSync(join(outputDir, '1-buyer-profile-reminder.html'), unifiedEmailTemplate(buyerEmail))
console.log('   ✅ Saved to test-emails/1-buyer-profile-reminder.html')

// Test 2: Seller Email (Green theme)
console.log('2️⃣  Generating Seller Draft Reminder...')
const sellerEmail: EmailTemplateOptions = {
  preheader: 'Your listing has been in draft for 10 days. Publish it to reach buyers!',
  title: 'Your Listing is Ready to Publish',
  recipientRole: 'SELLER',
  content: `
    <p>Hi Sarah,</p>
    <p>Your listing <strong>"Boutique Coffee Shop"</strong> has been in draft for <strong>10 days</strong>.</p>
    <p>Publishing your listing will:</p>
    <ul>
      <li><strong>Reach qualified buyers</strong> actively looking for businesses like yours</li>
      <li><strong>Generate inquiries</strong> from interested parties</li>
      <li><strong>Maintain confidentiality</strong> with NDA protection</li>
    </ul>
    <p>To publish, please complete: Financial Statements, Lease Details</p>
  `,
  cta: {
    label: 'Complete & Publish Listing',
    url: 'http://localhost:3000/listings/123/edit'
  },
  secondaryCta: {
    label: 'Preview Listing',
    url: 'http://localhost:3000/listings/123/preview'
  },
  nextSteps: [
    'Add missing financial information',
    'Review your listing for accuracy',
    'Publish to start receiving inquiries'
  ]
}
writeFileSync(join(outputDir, '2-seller-draft-reminder.html'), unifiedEmailTemplate(sellerEmail))
console.log('   ✅ Saved to test-emails/2-seller-draft-reminder.html')

// Test 3: Broker Email (Purple theme)
console.log('3️⃣  Generating Broker Deal Update...')
const brokerEmail: EmailTemplateOptions = {
  preheader: 'New activity on your managed deals',
  title: 'Weekly Deal Activity Summary',
  recipientRole: 'BROKER',
  content: `
    <p>Hi Michael,</p>
    <p>Here's your weekly summary of activity on your managed deals:</p>
    <h3 style="color: #111827; margin: 20px 0 10px 0;">Active Deals: 8</h3>
    <ul>
      <li>3 deals in due diligence</li>
      <li>2 LOIs pending signature</li>
      <li>3 deals in negotiation</li>
    </ul>
    <p><strong>Action Required:</strong> 2 deals need your attention</p>
  `,
  cta: {
    label: 'View All Deals',
    url: 'http://localhost:3000/broker/deals'
  },
  nextSteps: [
    'Review deals requiring your attention',
    'Follow up with buyers and sellers',
    'Update deal status and notes'
  ]
}
writeFileSync(join(outputDir, '3-broker-deal-update.html'), unifiedEmailTemplate(brokerEmail))
console.log('   ✅ Saved to test-emails/3-broker-deal-update.html')

// Test 4: Default Theme (No role)
console.log('4️⃣  Generating General Notification...')
const generalEmail: EmailTemplateOptions = {
  preheader: 'Important update about your account',
  title: 'Your Account Has Been Verified',
  content: `
    <p>Great news!</p>
    <p>Your account has been successfully verified. You now have access to all platform features.</p>
    <p>What you can do now:</p>
    <ul>
      <li>Browse all active listings</li>
      <li>Contact sellers directly</li>
      <li>Request NDAs for confidential information</li>
      <li>Create and manage dealrooms</li>
    </ul>
  `,
  cta: {
    label: 'Explore Listings',
    url: 'http://localhost:3000/listings'
  },
  footer: {
    includePreferences: true,
    includeSupportLink: true,
    customText: 'Thank you for being part of the SellerFi community!'
  }
}
writeFileSync(join(outputDir, '4-general-notification.html'), unifiedEmailTemplate(generalEmail))
console.log('   ✅ Saved to test-emails/4-general-notification.html')

// Test 5: Email with all features
console.log('5️⃣  Generating Full-Featured Email...')
const fullFeaturedEmail: EmailTemplateOptions = {
  preheader: 'Complete guide to using all email template features',
  title: 'Email Template Feature Showcase',
  recipientRole: 'BUYER',
  content: `
    <p>Hi there,</p>
    <p>This email demonstrates all available template features:</p>
    <h3 style="color: #111827; margin: 20px 0 10px 0;">Features Included:</h3>
    <ul>
      <li><strong>Preheader text</strong> - Shows in email client preview</li>
      <li><strong>Role-specific colors</strong> - Blue for buyers, green for sellers, purple for brokers</li>
      <li><strong>Primary and secondary CTAs</strong> - See buttons below</li>
      <li><strong>Next steps guidance</strong> - Actionable items for users</li>
      <li><strong>Mobile responsive</strong> - Looks great on all devices</li>
      <li><strong>Dark mode compatible</strong> - Works in dark mode email clients</li>
    </ul>
    <p>All templates maintain consistent branding while adapting to the recipient's role.</p>
  `,
  cta: {
    label: 'Primary Action Button',
    url: 'http://localhost:3000/action'
  },
  secondaryCta: {
    label: 'Secondary Action',
    url: 'http://localhost:3000/secondary'
  },
  nextSteps: [
    'Review the HTML source code to see the implementation',
    'Test in multiple email clients (Gmail, Outlook, Apple Mail)',
    'Verify mobile responsiveness on actual devices',
    'Check dark mode rendering if your client supports it'
  ],
  footer: {
    includePreferences: true,
    includeSupportLink: true,
    customText: 'This is a test email showcasing all template features.'
  }
}
writeFileSync(join(outputDir, '5-full-featured.html'), unifiedEmailTemplate(fullFeaturedEmail))
console.log('   ✅ Saved to test-emails/5-full-featured.html')

console.log('\n✨ All email templates generated successfully!')
console.log(`📁 Open test-emails/ directory to view the HTML files\n`)
console.log('💡 Testing Checklist:')
console.log('   ✓ Open files in web browser')
console.log('   ✓ Test in Gmail (web and mobile)')
console.log('   ✓ Test in Outlook (web and desktop)')
console.log('   ✓ Test in Apple Mail')
console.log('   ✓ Check mobile responsiveness')
console.log('   ✓ Verify dark mode rendering')
console.log('   ✓ Test CTA button clicks\n')
