import { Router } from 'express';
import { Pool } from 'pg';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const migrateRouter = Router();

const OLD_DB_URL = process.env.OLD_DATABASE_URL;

migrateRouter.post('/migrate-data', async (req, res, next) => {
  try {
    if (!OLD_DB_URL) {
      return res.status(500).json({ success: false, message: 'OLD_DATABASE_URL not set' });
    }

    const oldPool = new Pool({ connectionString: OLD_DB_URL, ssl: { rejectUnauthorized: false } });
    const results: Record<string, number> = {};

    // 1. Users
    const { rows: users } = await oldPool.query('SELECT * FROM "User"');
    for (const u of users) {
      try {
        await prisma.user.upsert({
          where: { id: u.id },
          update: { email: u.email, password: u.password, fullname: u.fullname, role: u.role, matricNo: u.matricNo, level: u.level, hostel: u.hostel, pin: u.pin, biometricEnabled: u.biometricEnabled, verified: u.verified, mealBreakfast: u.mealBreakfast, mealLunch: u.mealLunch, mealDinner: u.mealDinner, isVisitor: u.isVisitor },
          create: { id: u.id, email: u.email, password: u.password, fullname: u.fullname, role: u.role, matricNo: u.matricNo, level: u.level, hostel: u.hostel, pin: u.pin, biometricEnabled: u.biometricEnabled, verified: u.verified, mealBreakfast: u.mealBreakfast, mealLunch: u.mealLunch, mealDinner: u.mealDinner, isVisitor: u.isVisitor, createdAt: u.createdAt, updatedAt: u.updatedAt },
        });
      } catch (e: any) { console.error('[migrate] user skip', u.id, e.message); }
    }
    results.users = users.length;

    // 2. Wallets
    const { rows: wallets } = await oldPool.query('SELECT * FROM "Wallet"');
    for (const w of wallets) {
      try {
        await prisma.wallet.upsert({
          where: { userId: w.userId },
          update: { balance: w.balance },
          create: { id: w.id, userId: w.userId, balance: w.balance, createdAt: w.createdAt, updatedAt: w.updatedAt },
        });
      } catch (e: any) { console.error('[migrate] wallet skip', w.id, e.message); }
    }
    results.wallets = wallets.length;

    // 3. Restaurants
    const { rows: restaurants } = await oldPool.query('SELECT * FROM "Restaurant"');
    for (const r of restaurants) {
      try {
        await prisma.restaurant.upsert({
          where: { name: r.name },
          update: { icon: r.icon, isActive: r.isActive },
          create: { id: r.id, name: r.name, icon: r.icon, isActive: r.isActive, createdAt: r.createdAt },
        });
      } catch (e: any) { console.error('[migrate] restaurant skip', r.id, e.message); }
    }
    results.restaurants = restaurants.length;

    // 4. Hostels
    const { rows: hostels } = await oldPool.query('SELECT * FROM "Hostel"');
    for (const h of hostels) {
      try {
        await prisma.hostel.upsert({
          where: { name: h.name },
          update: { capacity: h.capacity, occupants: h.occupants, status: h.status },
          create: { id: h.id, name: h.name, capacity: h.capacity, occupants: h.occupants, status: h.status, createdAt: h.createdAt },
        });
      } catch (e: any) { console.error('[migrate] hostel skip', h.id, e.message); }
    }
    results.hostels = hostels.length;

    // 5. Levels
    const { rows: levels } = await oldPool.query('SELECT * FROM "Level"');
    for (const l of levels) {
      try {
        await prisma.level.upsert({
          where: { name: l.name },
          update: { cap: l.cap, plan: l.plan },
          create: { id: l.id, name: l.name, cap: l.cap, plan: l.plan, createdAt: l.createdAt },
        });
      } catch (e: any) { console.error('[migrate] level skip', l.id, e.message); }
    }
    results.levels = levels.length;

    // 6. GlobalConfig
    const { rows: configs } = await oldPool.query('SELECT * FROM "GlobalConfig"');
    for (const c of configs) {
      try {
        await prisma.globalConfig.upsert({
          where: { id: c.id },
          update: { breakfastRate: c.breakfastRate, lunchRate: c.lunchRate, dinnerRate: c.dinnerRate, allThreeRate: c.allThreeRate, feedingAmount: c.feedingAmount, session: c.session, updatedBy: c.updatedBy },
          create: { id: c.id, breakfastRate: c.breakfastRate, lunchRate: c.lunchRate, dinnerRate: c.dinnerRate, allThreeRate: c.allThreeRate, feedingAmount: c.feedingAmount, session: c.session, updatedBy: c.updatedBy, updatedAt: c.updatedAt },
        });
      } catch (e: any) { console.error('[migrate] config skip', c.id, e.message); }
    }
    results.configs = configs.length;

    // 7. Transactions
    const { rows: txs } = await oldPool.query('SELECT * FROM "Transaction" ORDER BY "createdAt" ASC');
    for (const t of txs) {
      try {
        const exists = await prisma.transaction.findFirst({ where: { reference: t.reference } });
        if (!exists) {
          await prisma.transaction.create({
            data: { id: t.id, studentId: t.studentId, vendorId: t.vendorId, vendorName: t.vendorName, type: t.type, gross: t.gross, levy: t.levy, vendorPayout: t.vendorPayout, balanceAfter: t.balanceAfter, status: t.status, reference: t.reference, hostel: t.hostel, level: t.level, createdAt: t.createdAt },
          });
        }
      } catch (e: any) { console.error('[migrate] tx skip', t.id, e.message); }
    }
    results.transactions = txs.length;

    // 8. ActivityLogs
    const { rows: logs } = await oldPool.query('SELECT * FROM "ActivityLog"');
    for (const l of logs) {
      try {
        const exists = await prisma.activityLog.findFirst({ where: { actorId: l.actorId, action: l.action, createdAt: l.createdAt } });
        if (!exists) {
          await prisma.activityLog.create({
            data: { id: l.id, actorId: l.actorId, actorEmail: l.actorEmail, action: l.action, target: l.target, hostel: l.hostel, metadata: l.metadata, ip: l.ip, createdAt: l.createdAt },
          });
        }
      } catch (e: any) { console.error('[migrate] log skip', l.id, e.message); }
    }
    results.activityLogs = logs.length;

    // 9. FoodItems
    const { rows: foods } = await oldPool.query('SELECT * FROM "FoodItem"');
    for (const f of foods) {
      try {
        const exists = await prisma.foodItem.findFirst({ where: { vendorId: f.vendorId, name: f.name } });
        if (!exists) {
          await prisma.foodItem.create({
            data: { id: f.id, vendorId: f.vendorId, name: f.name, cost: f.cost, category: f.category, pictureUrl: f.pictureUrl, available: f.available, createdAt: f.createdAt, updatedAt: f.updatedAt },
          });
        }
      } catch (e: any) { console.error('[migrate] food skip', f.id, e.message); }
    }
    results.foodItems = foods.length;

    // 10. OtpCodes
    const { rows: otps } = await oldPool.query('SELECT * FROM "OtpCode"');
    for (const o of otps) {
      try {
        const exists = await prisma.otpCode.findFirst({ where: { email: o.email, code: o.code, purpose: o.purpose } });
        if (!exists) {
          await prisma.otpCode.create({
            data: { id: o.id, email: o.email, code: o.code, purpose: o.purpose, expiresAt: o.expiresAt, used: o.used, createdAt: o.createdAt },
          });
        }
      } catch (e: any) { console.error('[migrate] otp skip', o.id, e.message); }
    }
    results.otpCodes = otps.length;

    // 11. PaymentOrders
    const { rows: orders } = await oldPool.query('SELECT * FROM "PaymentOrder"');
    for (const o of orders) {
      try {
        const exists = await prisma.paymentOrder.findFirst({ where: { shortCode: o.shortCode } });
        if (!exists) {
          await prisma.paymentOrder.create({
            data: { id: o.id, studentId: o.studentId, vendorId: o.vendorId, items: o.items, totalAmount: o.totalAmount, qrCode: o.qrCode, shortCode: o.shortCode, status: o.status, expiresAt: o.expiresAt, confirmedAt: o.confirmedAt, createdAt: o.createdAt },
          });
        }
      } catch (e: any) { console.error('[migrate] order skip', o.id, e.message); }
    }
    results.paymentOrders = orders.length;

    await oldPool.end();

    console.log('[migrate] completed:', results);

    res.json({ success: true, message: 'Data migrated from Render PostgreSQL to Supabase', data: results });
  } catch (e) { next(e); }
});
