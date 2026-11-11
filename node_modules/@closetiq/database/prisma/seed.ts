import { PrismaClient } from '@closetiq/database';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('No example users, merchant catalog, or image assets are seeded.');
}

main()
  .catch((error: unknown) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
