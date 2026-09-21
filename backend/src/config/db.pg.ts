import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { env } from './env.js';

/**
 * Prisma Client — global singleton.
 * In serverless / multi-invocation environments, creating multiple
 * PrismaClient instances exhausts connection limits and causes
 * "prepared statement does not exist" errors with Supabase pooler.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: env.databaseUrl,
  log: env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
});

if (env.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Raw pg Pool for health checks / direct queries — enables SSL for Supabase
export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false },
});

export async function connectPostgres() {
  await prisma.$connect();
  console.log('[pg] connected to Supabase');
}
