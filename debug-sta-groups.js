
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const kondisiCounts = await prisma.sta.groupBy({
    by: ['kondisi'],
    _count: true
  });
  const perkerasanCounts = await prisma.sta.groupBy({
    by: ['perkerasan'],
    _count: true
  });
  console.log('Kondisi Counts:', JSON.stringify(kondisiCounts, null, 2));
  console.log('Perkerasan Counts:', JSON.stringify(perkerasanCounts, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
