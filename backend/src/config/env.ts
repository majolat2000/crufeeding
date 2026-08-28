import dotenv from 'dotenv';
dotenv.config();

/**
 * Typed env — fails fast if required secrets missing.
 */
export const env = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/crawford_feeding',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  levyRate: parseFloat(process.env.PLATFORM_LEVY_RATE ?? '0.10'), // 10% third-party levy
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const;

if (!process.env.JWT_SECRET && env.nodeEnv === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}
