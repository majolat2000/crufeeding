import dotenv from 'dotenv';
dotenv.config();

/**
 * Typed env — fails fast if required secrets missing.
 */
function buildDatabaseUrl(raw: string): string {
  // Strip any existing pgbouncer/prepared_statements params to avoid duplicates
  let url = raw
    .replace(/[?&]pgbouncer=true/, '')
    .replace(/[?&]prepared_statements=false/, '')
    .replace(/[?&]connection_limit=\d+/, '');

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}pgbouncer=true&prepared_statements=false&connection_limit=5`;
}

export const env = {
  port: parseInt(process.env.PORT ?? '10000', 10),
  databaseUrl: buildDatabaseUrl(process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/crawford_feeding'),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY ?? '',
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? '',
  supabaseJwksUrl: process.env.SUPABASE_JWKS_URL ?? '',
} as const;

if (!process.env.JWT_SECRET && env.nodeEnv === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}
