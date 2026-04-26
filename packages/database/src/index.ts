import { PrismaClient } from '@prisma/client';
import { logger } from '@packages/logger';

export const prisma = new PrismaClient();

export const connectDatabase = async () => {
  await prisma.$connect();
  logger.info('database_connected');
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  logger.info('database_disconnected');
};
