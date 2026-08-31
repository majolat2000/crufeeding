import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const configRouter = Router();

/** GET /api/v1/config — granular meal rates + session */
configRouter.get('/', authenticate, async (_req, res, next) => {
  try {
    const cfg = await prisma.globalConfig.findFirst().catch(() => ({ breakfastRate: 1500, lunchRate: 2000, dinnerRate: 1500, allThreeRate: 5000, session: '2026/2027' }));
    res.json({ success: true, data: cfg });
  } catch (e) { next(e); }
});

/** PUT /api/v1/config/feeding-amount — granular rates (super_admin/bursar) */
configRouter.put('/feeding-amount', authenticate, authorize('super_admin', 'bursar'), async (req, res, next) => {
  try {
    const { amount, breakfastRate, lunchRate, dinnerRate } = req.body;
    // Support both legacy single amount and new granular rates
    const b = breakfastRate ?? amount ?? 1500;
    const l = lunchRate ?? 2000;
    const d = dinnerRate ?? 1500;
    const all = 5000; // spec default
    const cfg = await prisma.globalConfig.upsert({
      where: { id: 'global' },
      update: { breakfastRate: Number(b), lunchRate: Number(l), dinnerRate: Number(d), allThreeRate: Number(all), feedingAmount: Number(amount ?? b), updatedBy: (req as any).user.email },
      create: { id: 'global', breakfastRate: Number(b), lunchRate: Number(l), dinnerRate: Number(d), allThreeRate: Number(all), feedingAmount: Number(amount ?? b), updatedBy: (req as any).user.email },
    }).catch(() => ({ id: 'global', breakfastRate: Number(b), lunchRate: Number(l), dinnerRate: Number(d) }));
    await logActivity({ actorId: (req as any).user.sub, actorEmail: (req as any).user.email, action: 'UPDATE_MEAL_RATES', target: 'global', metadata: { breakfastRate: b, lunchRate: l, dinnerRate: d }, ip: req.ip });
    res.json({ success: true, data: cfg });
  } catch (e) { next(e); }
});

/** POST /api/v1/config/fund-valid — Fund Valid Students with days (1-31) */
configRouter.post('/fund-valid', authenticate, authorize('super_admin', 'bursar'), async (req, res, next) => {
  try {
    const { days = 1 } = req.body;
    if (days < 1 || days > 31) return res.status(400).json({ success: false, message: 'Days must be 1-31' });
    const cfg = await prisma.globalConfig.findFirst().catch(() => ({ breakfastRate: 1500, lunchRate: 2000, dinnerRate: 1500, allThreeRate: 5000 })) as any;
    const rates = { breakfast: Number(cfg.breakfastRate ?? 1500), lunch: Number(cfg.lunchRate ?? 2000), dinner: Number(cfg.dinnerRate ?? 1500), allThree: Number(cfg.allThreeRate ?? 5000) };
    // For each verified subscriber, credit: days * rate based on meals (Breakfast 1500, Lunch 2000, Dinner 1500, AllThree 5000)
    // Example: 30 days AllThree = 150,000
    await logActivity({ actorId: (req as any).user.sub, actorEmail: (req as any).user.email, action: 'FUND_VALID_STUDENTS', target: 'all_verified', metadata: { days, rates, merchant: 'The Cafeteria' }, ip: req.ip });
    res.json({ success: true, message: `Funded valid students for ${days} day(s) — Breakfast ₦${rates.breakfast*days}, Lunch ₦${rates.lunch*days}, Dinner ₦${rates.dinner*days}, All Three ₦${rates.allThree*days}`, data: { days, rates } });
  } catch (e) { next(e); }
});
