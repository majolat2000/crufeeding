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
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 3000;

export async function connectPostgres(): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await prisma.$connect();
      console.log(`[pg] connected to Supabase (attempt ${attempt})`);
      return;
    } catch (err: any) {
      const delay = INITIAL_DELAY_MS * attempt;
      console.error(`[pg] connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`[pg] retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  console.error('[pg] all connection attempts failed — exiting');
  process.exit(1);
}
