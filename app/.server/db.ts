import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import pg from 'pg';

// Get the database URL
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  return url;
};

// Create PostgreSQL connection pool for the adapter
const createPool = () => {
  return new pg.Pool({ connectionString: getDatabaseUrl() });
};

// Create base Prisma client with PostgreSQL adapter (Prisma 7 requirement)
const createPrismaClient = () => {
  const pool = createPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

// Global instance to prevent multiple connections in development
declare global {
  var __db__: PrismaClient | undefined;
  var __db_accelerate__: ReturnType<typeof createAccelerateClient> | undefined;
}

// Create Accelerate-enabled client
// Uses accelerateUrl in Prisma 7 instead of datasourceUrl
const createAccelerateClient = () => {
  const accelerateUrl = process.env.ACCELERATE_URL;
  if (accelerateUrl) {
    // Use Accelerate in production
    const client = new PrismaClient({
      accelerateUrl,
    }).$extends(withAccelerate());
    return client;
  } else {
    // Fall back to direct connection in development
    const pool = createPool();
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter }).$extends(withAccelerate());
    return client;
  }
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
