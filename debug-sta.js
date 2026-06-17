
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const staSample = await prisma.sta.findMany({
    take: 10,
    select: {
      sta: true,
      kondisi: true,
      perkerasan: true
    }
  });
  console.log(JSON.stringify(staSample, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
