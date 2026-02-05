/**
 * Fix script for dealrooms stuck at NDA_SIGNED despite having messages
 * 
 * Problem: Dealrooms with messages should be at INITIAL_REVIEW stage,
 * but some were created before the stage advancement logic was implemented.
 * 
 * This script:
 * 1. Finds all dealrooms at NDA_SIGNED status
 * 2. Checks if they have any messages
 * 3. If they have messages, updates them to INITIAL_REVIEW
 * 
 * Run with: npx tsx scripts/fix-stuck-dealroom-statuses.ts
 */

import { prisma } from "../lib/prisma"

async function fixStuckDealroomStatuses() {
  console.log("🔧 Fixing dealrooms stuck at NDA_SIGNED with messages...\n")

  try {
    // Find all dealrooms at NDA_SIGNED status that have messages
    const stuckDealrooms = await prisma.dealroom.findMany({
      where: {
        status: "NDA_SIGNED",
        ndaAccepted: true,
      },
      include: {
        messages: {
          select: { id: true },
        },
        listing: {
          select: { title: true },
        },
        buyer: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    })

    console.log(`📊 Found ${stuckDealrooms.length} dealrooms at NDA_SIGNED status\n`)

    let fixedCount = 0
    const fixes: { id: string; listing: string; buyer: string; messageCount: number }[] = []

    for (const dealroom of stuckDealrooms) {
      const messageCount = dealroom.messages.length

      if (messageCount > 0) {
        // Update to INITIAL_REVIEW
        await prisma.dealroom.update({
          where: { id: dealroom.id },
          data: {
            status: "INITIAL_REVIEW",
            lastActivityAt: new Date(),
            activities: {
              create: {
                userId: null,
                activityType: "STAGE_ADVANCED",
                description: `Deal stage auto-corrected from NDA_SIGNED to INITIAL_REVIEW (had ${messageCount} messages)`,
                metadata: {
                  fromStatus: "NDA_SIGNED",
                  toStatus: "INITIAL_REVIEW",
                  trigger: "FIX_SCRIPT",
                  reason: "Dealroom had messages but was stuck at NDA_SIGNED",
                  messageCount,
                  timestamp: new Date().toISOString(),
                },
              },
            },
          },
        })

        fixedCount++
        fixes.push({
          id: dealroom.id,
          listing: dealroom.listing.title || "Unknown",
          buyer: dealroom.buyer ? `${dealroom.buyer.firstName || ''} ${dealroom.buyer.lastName || ''}`.trim() || dealroom.buyer.email : "Unknown",
          messageCount,
        })
      }
    }

    console.log("─".repeat(80))
    
    if (fixedCount > 0) {
      console.log(`\n✅ Fixed ${fixedCount} dealrooms:\n`)
      fixes.forEach((fix, i) => {
        console.log(`${i + 1}. ${fix.listing}`)
        console.log(`   Buyer: ${fix.buyer}`)
        console.log(`   Messages: ${fix.messageCount}`)
        console.log(`   ID: ${fix.id}`)
        console.log("")
      })
    } else {
      console.log("\n✅ No stuck dealrooms found! All dealrooms are correctly staged.\n")
    }

    // Also check for other potential issues
    const statusCounts = await prisma.dealroom.groupBy({
      by: ["status"],
      _count: { status: true },
      orderBy: { _count: { status: "desc" } },
    })

    console.log("📊 Current Dealroom Status Distribution:")
    console.log("─".repeat(40))
    statusCounts.forEach(({ status, _count }) => {
      console.log(`   ${status.padEnd(20)} ${_count.status}`)
    })
    console.log("─".repeat(40))

    process.exit(0)
  } catch (error) {
    console.error("❌ Error fixing dealroom statuses:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

fixStuckDealroomStatuses()

