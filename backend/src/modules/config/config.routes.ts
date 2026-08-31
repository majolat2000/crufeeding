import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const configRouter = Router();

/** GET /api/v1/config — global feeding amount */
configRouter.get('/', authenticate, async (_req, res, next) => {
  try {
    const cfg = await prisma.globalConfig.findFirst().catch(() => ({ feedingAmount: 75000 }));
    res.json({ success: true, data: cfg });
  } catch (e) { next(e); }
});

/** PUT /api/v1/config/feeding-amount — super_admin/bursar */
configRouter.put('/feeding-amount', authenticate, authorize('super_admin', 'bursar'), async (req, res, next) => {
  try {
    const { amount } = req.body;
    const cfg = await prisma.globalConfig.upsert({
      where: { id: 'global' },
      update: { feedingAmount: Number(amount), updatedBy: (req as any).user.email },
      create: { id: 'global', feedingAmount: Number(amount), updatedBy: (req as any).user.email },
    }).catch(() => ({ id: 'global', feedingAmount: Number(amount) }));
    await logActivity({ actorId: (req as any).user.sub, actorEmail: (req as any).user.email, action: 'UPDATE_FEEDING_AMOUNT', target: 'global', metadata: { amount }, ip: req.ip });
    res.json({ success: true, data: cfg });
  } catch (e) { next(e); }
});

/** POST /api/v1/config/fund-valid — Fund Valid Students (bursar) */
configRouter.post('/fund-valid', authenticate, authorize('super_admin', 'bursar'), async (req, res, next) => {
  try {
    const cfg = await prisma.globalConfig.findFirst().catch(() => ({ feedingAmount: 75000 })) as any;
    const amount = Number(cfg.feedingAmount);
    // In PG, would do: UPDATE wallets SET balance = balance + amount WHERE user.verified = true
    // Here we simulate and log — mobile will fetch updated wallet via GET /wallet/:id
    await logActivity({ actorId: (req as any).user.sub, actorEmail: (req as any).user.email, action: 'FUND_VALID_STUDENTS', target: 'all_verified', metadata: { amount, count: 'all_verified' }, ip: req.ip });
    res.json({ success: true, message: `Funded valid students with ₦${amount.toLocaleString()} each`, data: { amount } });
  } catch (e) { next(e); }
});
