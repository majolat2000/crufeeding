import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

/**
 * PostgreSQL Prisma client — single source of truth for web + mobile.
 * Falls back to Mongo during migration if DATABASE_URL missing.
 */
export const prisma = new PrismaClient({
  datasourceUrl: env.databaseUrl,
  log: env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
});

export async function connectPostgres() {
  await prisma.$connect();
  console.log('[pg] connected');
}
