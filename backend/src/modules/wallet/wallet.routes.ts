import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { getWalletByStudentId, topUp } from './wallet.service.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const walletRouter = Router();

/** GET /api/v1/wallet/:studentId */
walletRouter.get('/:studentId', authenticate, async (req, res, next) => {
  try {
    const wallet = await getWalletByStudentId(req.params.studentId);
    res.json({ success: true, data: wallet });
  } catch (e) { next(e); }
});

/** POST /api/v1/wallet/:studentId/topup — bursar/super_admin */
walletRouter.post('/:studentId/topup', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    const { amount, reference } = req.body;
    const user = await prisma.user.findFirst({ where: { OR: [{ id: req.params.studentId }, { matricNo: req.params.studentId }] } });
    if (!user) return res.status(404).json({ success: false, message: 'Student not found' });
    const wallet = await topUp(user.id, Number(amount));
    await prisma.transaction.create({
      data: {
        studentId: user.id,
        vendorId: 'SYSTEM',
        vendorName: 'Wallet Top-up',
        type: 'credit',
        gross: Number(amount),
        levy: 0,
        vendorPayout: 0,
        balanceAfter: wallet.balance,
        status: 'success',
        reference: reference || `TOPUP-${Date.now()}`,
      },
    });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'WALLET_TOPUP', target: user.email, metadata: { amount, reference }, ip: req.ip });
    res.json({ success: true, data: wallet });
  } catch (e) { next(e); }
});

/** GET /api/v1/wallet — list all wallets (admin) */
walletRouter.get('/', authenticate, authorize('super_admin', 'bursar'), async (_req, res, next) => {
  try {
    const wallets = await prisma.wallet.findMany({ include: { user: { select: { id: true, email: true, fullname: true, matricNo: true, role: true, level: true, mealBreakfast: true, mealLunch: true, mealDinner: true } } }, orderBy: { updatedAt: 'desc' } });
    res.json({ success: true, data: wallets });
  } catch (e) { next(e); }
});
