import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const paymentRouter = Router();

/** POST /api/v1/payments/qr — process QR payment */
paymentRouter.post('/qr', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { studentId, vendorId, vendorName, amount, hostel, level } = req.body;
    if (!vendorId) return res.status(400).json({ success: false, message: 'vendorId required' });
    if (!amount || amount < 100) return res.status(400).json({ success: false, message: 'Minimum payment \u20A6100' });
    const user = await prisma.user.findFirst({ where: { OR: [{ id: studentId }, { matricNo: studentId }] } });
    if (!user) return res.status(404).json({ success: false, message: 'Student not found' });
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });
    const gross = Number(amount);
    if (Number(wallet.balance) < gross) return res.status(400).json({ success: false, message: 'Insufficient balance' });
    const newBalance = Number(wallet.balance) - gross;
    await prisma.wallet.update({ where: { userId: user.id }, data: { balance: newBalance } });
    const tx = await prisma.transaction.create({
      data: {
        studentId: user.id,
        vendorId,
        vendorName: vendorName || vendorId,
        type: 'debit',
        gross,
        levy: 0,
        vendorPayout: gross,
        balanceAfter: newBalance,
        status: 'success',
        reference: `QR-${Date.now()}-${user.id.slice(0, 6)}`,
        hostel: hostel || user.hostel,
        level: level || user.level,
      },
    });
    await logActivity({ actorId: user.id, actorEmail: user.email, action: 'QR_PAYMENT', target: vendorId, metadata: { amount: gross, vendorName }, ip: req.ip });
    res.status(201).json({ success: true, data: { transaction: tx, balance: newBalance } });
  } catch (e) { next(e); }
});

/** GET /api/v1/payments/transactions — real transactions */
paymentRouter.get('/transactions', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { studentId, limit = '50', offset = '0' } = req.query as any;
    const where: any = {};
    if (studentId) where.studentId = studentId;
    else     if (req.user!.role === ('user' as any) || req.user!.role === ('subscriber' as any)) where.studentId = req.user!.sub;
    const [rows, total] = await Promise.all([
      prisma.transaction.findMany({ where, orderBy: { createdAt: 'desc' }, take: Number(limit), skip: Number(offset) }),
      prisma.transaction.count({ where }),
    ]);
    res.json({ success: true, data: rows, total });
  } catch (e) { next(e); }
});

/** GET /api/v1/payments/ledger — alias for transactions */
paymentRouter.get('/ledger', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { studentId, limit = '20', offset = '0' } = req.query as any;
    const where: any = {};
    if (studentId) where.studentId = studentId;
    const [rows, total] = await Promise.all([
      prisma.transaction.findMany({ where, orderBy: { createdAt: 'desc' }, take: Number(limit), skip: Number(offset) }),
      prisma.transaction.count({ where }),
    ]);
    res.json({ success: true, data: rows, total });
  } catch (e) { next(e); }
});
