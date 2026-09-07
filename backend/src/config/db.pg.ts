import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { env } from './env.js';

/**
 * PostgreSQL — single source of truth (Render). Reads from process.env.DATABASE_URL.
 * SSL enabled in production for Render's managed Postgres (pg driver).
 */
export const prisma = new PrismaClient({
  datasourceUrl: env.databaseUrl,
  log: env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
});

// Raw pg Pool for health checks / direct queries — enables SSL in production
export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

export async function connectPostgres() {
  await prisma.$connect();
  console.log('[pg] connected to', env.databaseUrl.replace(/:[^:@]*@/, ':****@'));
}
