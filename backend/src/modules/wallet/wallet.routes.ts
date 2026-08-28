import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { getWallet, topUp } from './wallet.service.js';

export const walletRouter = Router();

/**
 * GET /api/v1/wallet/:studentId — student or bursar/super_admin
 */
walletRouter.get('/:studentId', authenticate, async (req, res, next) => {
  try {
    const wallet = await getWallet(req.params.studentId);
    res.json({ success: true, data: wallet });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/v1/wallet/:studentId/topup — bursar/super_admin only (RBAC)
 * Body: { amount: number, reference: string }
 */
walletRouter.post('/:studentId/topup', authenticate, authorize('super_admin', 'bursar'), async (req, res, next) => {
  try {
    const { amount } = req.body;
    const wallet = await topUp(req.params.studentId, Number(amount));
    // TODO: create ledger entry type='credit' + activity log
    res.json({ success: true, data: wallet });
  } catch (e) {
    next(e);
  }
});
