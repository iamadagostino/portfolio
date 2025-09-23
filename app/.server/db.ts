import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Create base Prisma client
const createPrismaClient = () => {
  return new PrismaClient({
    datasourceUrl: process.env.ACCELERATE_URL || process.env.DATABASE_URL,
  });
};

// Global instance to prevent multiple connections in development
declare global {
  var __db__: PrismaClient | undefined;
  var __db_accelerate__: ReturnType<typeof createAccelerateClient> | undefined;
}

// Create Accelerate-enabled client
const createAccelerateClient = () => {
  const client = createPrismaClient();
  return client.$extends(withAccelerate());
};

// Export regular Prisma client (for development/migrations)
export const prisma = globalThis.__db__ ?? createPrismaClient();

// Export Accelerate-enabled client (for production queries with caching)
export const prismaAccelerate = globalThis.__db_accelerate__ ?? createAccelerateClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.__db__ = prisma;
  globalThis.__db_accelerate__ = prismaAccelerate;
}

// Helper to get the appropriate client based on environment
export const getPrismaClient = () => {
  return process.env.ACCELERATE_URL ? prismaAccelerate : prisma;
};
