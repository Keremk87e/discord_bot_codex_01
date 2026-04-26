import { prisma } from './index.js';

async function main() {
  console.log('Seed ready. Add custom seeds here.');
}

main().finally(() => prisma.$disconnect());
