import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { env } from './config/env.js';
import { prisma, connectPostgres } from './config/db.pg.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { walletRouter } from './modules/wallet/wallet.routes.js';
import { paymentRouter } from './modules/payment/payment.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { configRouter } from './modules/config/config.routes.js';
import { activityLogRouter } from './modules/activityLog/activityLog.routes.js';
import { vendorRouter } from './modules/vendor/vendor.routes.js';
import { orderRouter } from './modules/order/order.routes.js';

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
app.use('/api/v1/vendor', vendorRouter);
app.use('/api/v1/orders', orderRouter);

app.use(notFound);
app.use(errorHandler);

async function seedDatabase() {
  try {
    // Fix stale meal plans: non-subscribers should have no meals selected
  const staleUsers = await prisma.user.updateMany({
    where: { role: { not: 'subscriber' }, OR: [{ mealBreakfast: true }, { mealLunch: true }, { mealDinner: true }] },
    data: { mealBreakfast: false, mealLunch: false, mealDinner: false },
  });
  if (staleUsers.count > 0) console.log(`[seed] reset ${staleUsers.count} non-subscriber users to no meal plan`);

  const userCount = await prisma.user.count();
    if (userCount > 0) {
      console.log(`[seed] ${userCount} users exist — checking vendor...`);
      const vendorExists = await prisma.user.findUnique({ where: { email: 'cafeteria@crawforduniversity.edu.ng' } });
      if (!vendorExists) {
        console.log('[seed] vendor missing — creating vendor account...');
        const vendorHash = await bcrypt.hash('cafeteria', 4);
        const vendor = await prisma.user.create({
          data: { email: 'cafeteria@crawforduniversity.edu.ng', password: vendorHash, fullname: 'The Cafeteria', role: 'vendor', verified: true },
        });
        await prisma.wallet.create({ data: { userId: vendor.id, balance: 0 } });
        console.log('[seed] vendor created');
      } else {
        console.log('[seed] vendor exists — skipping');
      }
      return;
    }
    console.log('[seed] no users found — seeding database...');

    const hash1 = await bcrypt.hash('CRUFEED@1#1', 4);
    const hash2 = await bcrypt.hash('12345678', 4);

    const superAdmin = await prisma.user.create({
      data: { email: 'majesty.olatimilehin@crawforduniversity.edu.ng', password: hash1, fullname: 'Majesty Olatimilehin', role: 'super_admin', verified: true },
    });
    await prisma.wallet.create({ data: { userId: superAdmin.id, balance: 0 } });

    const bursary = await prisma.user.create({
      data: { email: 'bursary@crawforduniversity.edu.ng', password: hash2, fullname: 'Bursary Department', role: 'bursar', verified: true },
    });
    await prisma.wallet.create({ data: { userId: bursary.id, balance: 0 } });

    const vendorHash = await bcrypt.hash('cafeteria', 4);
    const vendor = await prisma.user.create({
      data: { email: 'cafeteria@crawforduniversity.edu.ng', password: vendorHash, fullname: 'The Cafeteria', role: 'vendor', verified: true },
    });
    await prisma.wallet.create({ data: { userId: vendor.id, balance: 0 } });

    await prisma.restaurant.upsert({ where: { name: 'The Cafeteria' }, update: {}, create: { name: 'The Cafeteria', isActive: true } });
    await prisma.globalConfig.upsert({ where: { id: 'global' }, update: {}, create: { id: 'global', session: '2025/2026' } });

    const levels = ['JUPEB', '100 LEVEL', '200 LEVEL', '300 LEVEL', '500 LEVEL', 'Visitor'];
    for (const name of levels) {
      await prisma.level.upsert({ where: { name }, update: {}, create: { name, cap: 2000, plan: name === 'Visitor' ? 'Basic' : 'Standard' } });
    }

    console.log('[seed] created Super Admin + Bursary + Vendor + Cafeteria + Levels');
  } catch (e) {
    console.error('[seed] error:', e);
  }
}

const start = async () => {
  await connectPostgres();
  await seedDatabase();
  app.listen(env.port, '0.0.0.0', () => console.log(`[backend] listening on 0.0.0.0:${env.port}`));
};

start();

export default app;
