/**
 * Script to promote a user to SELLER role
 * 
 * Usage:
 *   npx ts-node scripts/promote-to-seller.ts <email>
 * 
 * Example:
 *   npx ts-node scripts/promote-to-seller.ts user@example.com
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error('Usage: npx ts-node scripts/promote-to-seller.ts <email>')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.error(`User with email "${email}" not found`)
    process.exit(1)
  }

  if (user.role === 'SELLER') {
    console.log(`User "${email}" is already a SELLER`)
    process.exit(0)
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: 'SELLER' },
  })

  console.log(`✅ User "${email}" has been promoted to SELLER`)
  console.log(`   Previous role: ${user.role}`)
  console.log(`   New role: ${updated.role}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

