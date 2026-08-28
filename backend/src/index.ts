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

// Health
app.get('/health', (_req, res) => res.json({ success: true, message: 'Crawford Feeding API ok', levyRate: env.levyRate }));
app.get('/api/v1/health', (_req, res) => res.json({ success: true, message: 'API v1 ok' }));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/admin', adminRouter);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    if (env.nodeEnv !== 'test') await connectDB();
  } catch (e) {
    console.warn('[db] connection failed — running without DB (set MONGO_URI):', (e as Error).message);
  }
  app.listen(env.port, () => console.log(`[backend] listening on http://localhost:${env.port} (levy ${env.levyRate * 100}%)`));
};

start();

export default app;
