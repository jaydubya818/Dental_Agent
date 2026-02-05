/**
 * Backfill Notification Preferences for Existing Users
 * 
 * Creates default notification preferences for users who don't have them yet.
 * Safe to run multiple times (idempotent).
 * 
 * Run with: npx tsx scripts/backfill-notification-preferences.ts
 */

import { prisma } from '../lib/prisma'

async function backfillNotificationPreferences() {
  console.log('🔄 Starting notification preferences backfill...\n')
  
  try {
    // Find all users without notification preferences
    const usersWithoutPreferences = await prisma.user.findMany({
      where: {
        subscription: null // This means no NotificationPreference exists
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    })
    
    // Actually, let's use a better query - check for missing preferences directly
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true
      }
    })
    
    const existingPreferences = await prisma.notificationPreference.findMany({
      select: {
        userId: true
      }
    })
    
    const existingUserIds = new Set(existingPreferences.map(p => p.userId))
    const usersNeedingPreferences = allUsers.filter(u => !existingUserIds.has(u.id))
    
    console.log(`📊 Found ${usersNeedingPreferences.length} users without preferences`)
    console.log(`📊 Found ${existingPreferences.length} users with existing preferences`)
    console.log(`📊 Total users: ${allUsers.length}\n`)
    
    if (usersNeedingPreferences.length === 0) {
      console.log('✅ All users already have notification preferences!')
      return
    }
    
    // Create preferences in batches of 100
    const batchSize = 100
    let created = 0
    let errors = 0
    
    for (let i = 0; i < usersNeedingPreferences.length; i += batchSize) {
      const batch = usersNeedingPreferences.slice(i, i + batchSize)
      
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(usersNeedingPreferences.length / batchSize)}...`)
      
      try {
        const result = await prisma.notificationPreference.createMany({
          data: batch.map(user => ({
            userId: user.id,
            // Core email preferences (opt-out model)
            emailNewListings: true,
            emailPriceDrops: true,
            emailDealActivity: true,
            emailWeeklyDigest: true,
            emailMarketingUpdates: false, // Marketing is opt-in
            
            // Workflow email preferences (opt-out model)
            emailProfileReminders: true,
            emailListingDraftReminders: true,
            emailDealroomInactivity: true,
            emailLOIMilestones: true,
            emailUnderContractUpdates: true,
            emailBuyerWeeklyDigest: true,
            emailSellerWeeklyDigest: true,
            
            // Push notification preferences
            pushNewMessages: true,
            pushNdaSigned: true,
            pushNewInquiry: true,
            pushDealUpdates: true,
            
            // Digest settings
            digestFrequency: 'weekly'
          })),
          skipDuplicates: true
        })
        
        created += result.count
        console.log(`   ✅ Created ${result.count} preferences`)
      } catch (error) {
        console.error(`   ❌ Error in batch:`, error)
        errors += batch.length
      }
    }
    
    console.log('\n📊 Backfill Summary:')
    console.log(`   ✅ Successfully created: ${created}`)
    console.log(`   ❌ Errors: ${errors}`)
    console.log(`   📈 Success rate: ${((created / usersNeedingPreferences.length) * 100).toFixed(1)}%`)
    
    // Verify the backfill
    const finalCount = await prisma.notificationPreference.count()
    const totalUsers = await prisma.user.count()
    
    console.log('\n✅ Backfill Complete!')
    console.log(`   Total preferences: ${finalCount}`)
    console.log(`   Total users: ${totalUsers}`)
    console.log(`   Coverage: ${((finalCount / totalUsers) * 100).toFixed(1)}%\n`)
    
  } catch (error) {
    console.error('❌ Backfill failed:', error)
    process.exit(1)
  }
}

// Run the backfill
backfillNotificationPreferences()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
