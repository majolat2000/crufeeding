import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectPostgres } from './config/db.pg.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { walletRouter } from './modules/wallet/wallet.routes.js';
import { paymentRouter } from './modules/payment/payment.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { configRouter } from './modules/config/config.routes.js';
import { activityLogRouter } from './modules/activityLog/activityLog.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.get('/health', (_req, res) => res.json({ success: true, message: 'Crawford Feeding API ok', payout: '100% direct to vendor' }));
app.get('/api/v1/health', (_req, res) => res.json({ success: true, message: 'API v1 ok' }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/config', configRouter);
app.use('/api/v1/activity-logs', activityLogRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectPostgres();
  app.listen(env.port, '0.0.0.0', () => console.log(`[backend] listening on 0.0.0.0:${env.port}`));
};

start();

export default app;
