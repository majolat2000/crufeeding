import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const paymentRouter = Router();

/** POST /api/v1/payments/qr — process QR payment */
paymentRouter.post('/qr', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { studentId, vendorId, vendorName, amount, hostel, level } = req.body;
    if (!vendorId) return res.status(400).json({ success: false, message: 'vendorId required' });
    if (!amount || amount < 100) return res.status(400).json({ success: false, message: 'Minimum payment ₦100' });
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

/** GET /api/v1/payments/transactions — real transactions with search */
paymentRouter.get('/transactions', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { studentId, vendorId, type, search, limit = '100', offset = '0' } = req.query as any;
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (vendorId) where.vendorId = vendorId;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { vendorName: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
        { student: { email: { contains: search, mode: 'insensitive' } } },
        { student: { matricNo: { contains: search, mode: 'insensitive' } } },
        { student: { fullname: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (!studentId && !vendorId && req.user!.role === ('user' as any) || req.user!.role === ('subscriber' as any)) {
      where.studentId = req.user!.sub;
    }
    const [rows, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: Number(offset),
      }),
      prisma.transaction.count({ where }),
    ]);

    // Fetch student info for each transaction
    const studentIds = [...new Set(rows.map((r: any) => r.studentId))];
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, email: true, fullname: true, matricNo: true },
    });
    const studentMap = new Map(students.map((s: any) => [s.id, s]));
    const enriched = rows.map((r: any) => ({ ...r, student: studentMap.get(r.studentId) || null }));

    res.json({ success: true, data: enriched, total });
  } catch (e) { next(e); }
});

/** POST /api/v1/payments/refund/:id — process refund */
paymentRouter.post('/refund/:id', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    const tx = await prisma.transaction.findUnique({ where: { id: req.params.id } });
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (tx.type === 'refund') return res.status(400).json({ success: false, message: 'Already refunded' });

    const student = await prisma.user.findUnique({ where: { id: tx.studentId }, select: { email: true, fullname: true } });
    const wallet = await prisma.wallet.findUnique({ where: { userId: tx.studentId } });
    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });

    const refundAmount = Number(tx.gross);
    const newBalance = Number(wallet.balance) + refundAmount;
    await prisma.wallet.update({ where: { userId: tx.studentId }, data: { balance: newBalance } });

    const refundTx = await prisma.transaction.create({
      data: {
        studentId: tx.studentId,
        vendorId: tx.vendorId,
        vendorName: `Refund: ${tx.vendorName}`,
        type: 'refund',
        gross: refundAmount,
        levy: 0,
        vendorPayout: 0,
        balanceAfter: newBalance,
        status: 'success',
        reference: `REFUND-${Date.now()}-${tx.id.slice(0, 6)}`,
        hostel: tx.hostel,
        level: tx.level,
      },
    });

    await logActivity({
      actorId: req.user!.sub,
      actorEmail: req.user!.email,
      action: 'REFUND',
      target: student?.email || tx.studentId,
      metadata: { originalTxId: tx.id, amount: refundAmount, vendorName: tx.vendorName },
      ip: req.ip,
    });

    res.json({ success: true, message: `Refunded ₦${refundAmount.toLocaleString()} to ${student?.email}`, data: { refundTx, newBalance } });
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
