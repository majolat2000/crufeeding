import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { walletRouter } from './modules/wallet/wallet.routes.js';
import { paymentRouter } from './modules/payment/payment.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

// Health — levy removed, direct payout
app.get('/health', (_req, res) => res.json({ success: true, message: 'Crawford Feeding API ok', payout: '100% direct to vendor' }));
app.get('/api/v1/health', (_req, res) => res.json({ success: true, message: 'API v1 ok' }));

// Routes — centralized PG + Mongoose hybrid
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/admin', adminRouter);
import { hostelRouter } from './modules/hostel/hostel.routes.js';
import { levelRouter } from './modules/level/level.routes.js';
import { configRouter } from './modules/config/config.routes.js';
import { activityLogRouter } from './modules/activityLog/activityLog.routes.js';
app.use('/api/v1/hostels', hostelRouter);
app.use('/api/v1/levels', levelRouter);
app.use('/api/v1/config', configRouter);
app.use('/api/v1/activity-logs', activityLogRouter);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  // Try Postgres first (single source of truth), fallback to Mongo during migration
  try {
    const { connectPostgres } = await import('./config/db.pg.js');
    await connectPostgres().catch(async () => {
      if (env.nodeEnv !== 'test') await connectDB();
    });
  } catch {
    if (env.nodeEnv !== 'test') await connectDB().catch((e) => console.warn('[db] failed', (e as Error).message));
  }
  app.listen(env.port, () => console.log(`[backend] listening on http://localhost:${env.port} (direct 100% payout)`));
};

start();

export default app;
