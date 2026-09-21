import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { env } from './env.js';

/**
 * PostgreSQL — Supabase. Reads from process.env.DATABASE_URL.
 * SSL enabled for Supabase (pg driver).
 */
export const prisma = new PrismaClient({
  datasourceUrl: env.databaseUrl,
  log: env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
});

// Raw pg Pool for health checks / direct queries — enables SSL for Supabase
export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false },
});

export async function connectPostgres() {
  await prisma.$connect();
  console.log('[pg] connected to Supabase');
}
