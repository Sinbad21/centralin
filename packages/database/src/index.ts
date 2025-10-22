import { PrismaClient } from '@prisma/client';

// Create Prisma client instance with logging
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Export Prisma types
export * from '@prisma/client';

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
