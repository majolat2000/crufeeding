import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const configRouter = Router();

/** GET /api/v1/config — granular meal rates + session */
configRouter.get('/', async (_req, res, next) => {
  try {
    let cfg = await prisma.globalConfig.findFirst();
    if (!cfg) {
      cfg = await prisma.globalConfig.create({ data: { id: 'global', session: '2025/2026' } });
    }
    res.json({ success: true, data: cfg });
  } catch (e) { next(e); }
});

/** PUT /api/v1/config/feeding-amount — granular rates */
configRouter.put('/feeding-amount', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    const { breakfastRate, lunchRate, dinnerRate, allThreeRate } = req.body;
    const data: any = { updatedBy: req.user!.email };
    if (breakfastRate !== undefined) data.breakfastRate = Number(breakfastRate);
    if (lunchRate !== undefined) data.lunchRate = Number(lunchRate);
    if (dinnerRate !== undefined) data.dinnerRate = Number(dinnerRate);
    if (allThreeRate !== undefined) data.allThreeRate = Number(allThreeRate);
    const cfg = await prisma.globalConfig.upsert({
      where: { id: 'global' },
      update: data,
      create: { id: 'global', ...data, session: '2025/2026' },
    });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'UPDATE_MEAL_RATES', target: 'global', metadata: data, ip: req.ip });
    res.json({ success: true, data: cfg });
  } catch (e) { next(e); }
});

/** PUT /api/v1/config/session — manual session update */
configRouter.put('/session', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    const { session } = req.body;
    if (!session || !/^\d{4}\/\d{4}$/.test(session)) return res.status(400).json({ success: false, message: 'Session must be YYYY/YYYY format' });
    const cfg = await prisma.globalConfig.upsert({
      where: { id: 'global' },
      update: { session, updatedBy: req.user!.email },
      create: { id: 'global', session, updatedBy: req.user!.email },
    });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'UPDATE_SESSION', target: session, metadata: { previous: cfg.session }, ip: req.ip });
    res.json({ success: true, data: cfg });
  } catch (e) { next(e); }
});

/** POST /api/v1/config/fund-valid — credits wallets of active subscribers */
configRouter.post('/fund-valid', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    const { days = 1 } = req.body;
    if (days < 1 || days > 31) return res.status(400).json({ success: false, message: 'Days must be 1-31' });
    const cfg = await prisma.globalConfig.findFirst();
    if (!cfg) return res.status(500).json({ success: false, message: 'No config found' });
    const rates = { breakfast: Number(cfg.breakfastRate), lunch: Number(cfg.lunchRate), dinner: Number(cfg.dinnerRate), allThree: Number(cfg.allThreeRate) };

    const subscribers = await prisma.user.findMany({ where: { role: 'subscriber', verified: true } });
    let funded = 0;
    let totalCredited = 0;

    for (const sub of subscribers) {
      let dailyRate = 0;
      const allMeals = sub.mealBreakfast && sub.mealLunch && sub.mealDinner;
      if (allMeals) {
        dailyRate = rates.allThree;
      } else {
        if (sub.mealBreakfast) dailyRate += rates.breakfast;
        if (sub.mealLunch) dailyRate += rates.lunch;
        if (sub.mealDinner) dailyRate += rates.dinner;
      }
      const amount = dailyRate * days;
      if (amount <= 0) continue;

      const wallet = await prisma.wallet.findUnique({ where: { userId: sub.id } });
      if (!wallet) continue;
      const newBalance = Number(wallet.balance) + amount;
      await prisma.wallet.update({ where: { userId: sub.id }, data: { balance: newBalance } });
      await prisma.transaction.create({
        data: {
          studentId: sub.id,
          vendorId: 'CAFETERIA',
          vendorName: 'The Cafeteria',
          type: 'credit',
          gross: amount,
          levy: 0,
          vendorPayout: 0,
          balanceAfter: newBalance,
          status: 'success',
          reference: `FUND-${Date.now()}-${sub.id.slice(0, 6)}`,
        },
      });
      funded++;
      totalCredited += amount;
    }

    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'FUND_VALID_STUDENTS', target: `${funded} subscribers`, metadata: { days, rates, totalCredited }, ip: req.ip });
    res.json({ success: true, message: `Funded ${funded} subscribers for ${days} day(s). Total credited: ₦${totalCredited.toLocaleString()}`, data: { days, funded, totalCredited, rates } });
  } catch (e) { next(e); }
});

/** POST /api/v1/config/fund-selective — fund specific subscribers */
configRouter.post('/fund-selective', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    const { days = 1, studentIds = [] } = req.body;
    if (days < 1 || days > 31) return res.status(400).json({ success: false, message: 'Days must be 1-31' });
    if (!studentIds.length) return res.status(400).json({ success: false, message: 'studentIds array required' });
    const cfg = await prisma.globalConfig.findFirst();
    if (!cfg) return res.status(500).json({ success: false, message: 'No config found' });
    const rates = { breakfast: Number(cfg.breakfastRate), lunch: Number(cfg.lunchRate), dinner: Number(cfg.dinnerRate), allThree: Number(cfg.allThreeRate) };

    const subscribers = await prisma.user.findMany({ where: { id: { in: studentIds }, role: 'subscriber', verified: true } });
    let funded = 0;
    let totalCredited = 0;

    for (const sub of subscribers) {
      let dailyRate = 0;
      const allMeals = sub.mealBreakfast && sub.mealLunch && sub.mealDinner;
      if (allMeals) {
        dailyRate = rates.allThree;
      } else {
        if (sub.mealBreakfast) dailyRate += rates.breakfast;
        if (sub.mealLunch) dailyRate += rates.lunch;
        if (sub.mealDinner) dailyRate += rates.dinner;
      }
      const amount = dailyRate * days;
      if (amount <= 0) continue;

      const wallet = await prisma.wallet.findUnique({ where: { userId: sub.id } });
      if (!wallet) continue;
      const newBalance = Number(wallet.balance) + amount;
      await prisma.wallet.update({ where: { userId: sub.id }, data: { balance: newBalance } });
      await prisma.transaction.create({
        data: {
          studentId: sub.id,
          vendorId: 'CAFETERIA',
          vendorName: 'The Cafeteria',
          type: 'credit',
          gross: amount,
          levy: 0,
          vendorPayout: 0,
          balanceAfter: newBalance,
          status: 'success',
          reference: `FUND-${Date.now()}-${sub.id.slice(0, 6)}`,
        },
      });
      funded++;
      totalCredited += amount;
    }

    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'FUND_SELECTIVE', target: `${funded} subscribers`, metadata: { days, studentIds, totalCredited }, ip: req.ip });
    res.json({ success: true, message: `Funded ${funded} subscribers for ${days} day(s). Total credited: ₦${totalCredited.toLocaleString()}`, data: { days, funded, totalCredited, rates } });
  } catch (e) { next(e); }
});

/** GET /api/v1/config/session — get current session (no auto-rollover) */
configRouter.get('/session', async (_req, res, next) => {
  try {
    const cfg = await prisma.globalConfig.findFirst();
    const now = new Date();
    const watOffset = 1 * 60 * 60 * 1000;
    const watNow = new Date(now.getTime() + watOffset);
    const session = cfg?.session || '2025/2026';
    res.json({ success: true, data: { session, serverTime: watNow.toISOString(), timezone: 'Africa/Lagos (WAT)' } });
  } catch (e) { next(e); }
});
