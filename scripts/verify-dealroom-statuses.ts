/**
 * Verification script to check dealroom status values in the database
 * Run with: npx tsx scripts/verify-dealroom-statuses.ts
 */

import { prisma } from "../lib/prisma"

async function verifyDealroomStatuses() {
  console.log("🔍 Verifying dealroom status values...\n")

  try {
    // Get all distinct status values from the database
    const statusCounts = await prisma.dealroom.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      orderBy: {
        _count: {
          status: "desc",
        },
      },
    })

    console.log("📊 Dealroom Status Distribution:")
    console.log("─".repeat(60))

    let totalActive = 0
    let totalClosed = 0
    const activeStatuses = [
      "DISCOVERY",
      "NDA_PENDING",
      "NDA_SIGNED",
      "INITIAL_REVIEW",
      "DUE_DILIGENCE",
      "NEGOTIATION",
      "LOI_PENDING",
      "LOI_SIGNED",
      "UNDER_CONTRACT",
    ]
    const closedStatuses = ["CLOSED_WON", "CLOSED_LOST"]
    const validStatuses = [...activeStatuses, ...closedStatuses]

    statusCounts.forEach(({ status, _count }) => {
      const count = _count.status
      const isActive = activeStatuses.includes(status)
      const isClosed = closedStatuses.includes(status)
      const isValid = validStatuses.includes(status)
      
      const indicator = isActive ? "✅ ACTIVE" : isClosed ? "🔒 CLOSED" : "⚠️  UNKNOWN"
      
      console.log(`${indicator}  ${status.padEnd(20)} ${count} dealrooms`)

      if (isActive) totalActive += count
      if (isClosed) totalClosed += count

      if (!isValid) {
        console.error(`❌ ERROR: Found unexpected status: ${status}`)
      }
    })

    console.log("─".repeat(60))
    console.log(`\n📈 Summary:`)
    console.log(`   Total Active:  ${totalActive}`)
    console.log(`   Total Closed:  ${totalClosed}`)
    console.log(`   Total:         ${totalActive + totalClosed}\n`)

    // Verify enum definition matches database
    const dbStatuses = statusCounts.map(s => s.status).sort()
    const enumStatuses = validStatuses.sort()
    
    const unexpectedStatuses = dbStatuses.filter(s => !enumStatuses.includes(s))
    const missingStatuses = enumStatuses.filter(s => !dbStatuses.includes(s))

    if (unexpectedStatuses.length > 0) {
      console.error("❌ UNEXPECTED STATUS VALUES IN DATABASE:")
      unexpectedStatuses.forEach(s => console.error(`   - ${s}`))
      console.error("\n   These statuses are not in the DealroomStatus enum!")
      console.error("   Update the enum or fix the data.\n")
    }

    if (missingStatuses.length > 0) {
      console.log("ℹ️  STATUS VALUES IN ENUM BUT NOT IN DATABASE:")
      missingStatuses.forEach(s => console.log(`   - ${s}`))
      console.log("\n   These are valid enum values with no dealrooms yet.\n")
    }

    if (unexpectedStatuses.length === 0) {
      console.log("✅ All database status values match the DealroomStatus enum\n")
    }

    // Verify the counts match what the reports endpoint would calculate
    const totalCount = await prisma.dealroom.count()
    const activeCount = await prisma.dealroom.count({
      where: {
        status: {
          notIn: ["CLOSED_WON", "CLOSED_LOST"]
        }
      }
    })

    console.log("📋 Reports Endpoint Verification:")
    console.log(`   Total (all dealrooms):           ${totalCount}`)
    console.log(`   Active (notIn CLOSED_*):         ${activeCount}`)
    console.log(`   Expected Active from groupBy:    ${totalActive}`)
    
    if (activeCount === totalActive) {
      console.log("   ✅ Counts match!\n")
    } else {
      console.error("   ❌ Counts don't match! Check the query logic.\n")
    }

    process.exit(0)
  } catch (error) {
    console.error("❌ Error verifying dealroom statuses:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDealroomStatuses()
