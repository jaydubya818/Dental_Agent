import { prisma } from '../lib/prisma';

async function verify() {
  console.log('🔍 Verifying RAG data in database...\n');

  const docs = await prisma.ragDocument.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      category: true,
      _count: {
        select: {
          chunks: true,
        },
      },
    },
  });

  console.log(`📄 Documents: ${docs.length}`);
  docs.forEach(doc => {
    console.log(`   - ${doc.title}`);
    console.log(`     Status: ${doc.status}`);
    console.log(`     Chunks: ${doc._count.chunks}`);
  });

  const totalChunks = await prisma.ragChunk.count();
  console.log(`\n📦 Total chunks: ${totalChunks}`);

  const conversations = await prisma.ragConversation.count();
  console.log(`💬 Total conversations: ${conversations}\n`);

  console.log('✅ Verification complete!');
}

verify()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
