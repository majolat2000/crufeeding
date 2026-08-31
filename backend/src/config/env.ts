import dotenv from 'dotenv';
dotenv.config();

/**
 * Typed env — fails fast if required secrets missing.
 */
export const env = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  // PostgreSQL is now the single source of truth (replaces Mongo URI if DATABASE_URL is set)
  databaseUrl: process.env.DATABASE_URL ?? process.env.MONGO_URI ?? 'postgresql://postgres:postgres@localhost:5432/crawford_feeding',
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/crawford_feeding', // kept for backward compat during migration
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const;

if (!process.env.JWT_SECRET && env.nodeEnv === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}
