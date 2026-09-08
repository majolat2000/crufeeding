import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';
import crypto from 'crypto';

export const orderRouter = Router();

function generateShortCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function generateQRData(orderId: string, shortCode: string): string {
  return `CRUFEED|${orderId}|${shortCode}`;
}

const ORDER_TTL_MINUTES = 5;

/** POST /api/v1/orders — create payment order (student) */
orderRouter.post('/', authenticate, authorize('student'), async (req: AuthRequest, res, next) => {
  try {
    const { items, pin } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items required' });
    }
    if (!pin) return res.status(400).json({ success: false, message: 'Transaction PIN required' });

    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!user.pin) return res.status(400).json({ success: false, message: 'No transaction PIN set. Please set one in Profile.' });

    const pinValid = await import('bcryptjs').then(b => b.default.compare(pin, user.pin!));
    if (!pinValid) return res.status(401).json({ success: false, message: 'Invalid transaction PIN' });

    let totalAmount = 0;
    const orderItems: { foodItemId: string; name: string; cost: number; quantity: number }[] = [];
    for (const item of items) {
      const foodItem = await prisma.foodItem.findUnique({ where: { id: item.foodItemId } });
      if (!foodItem || !foodItem.available) {
        return res.status(400).json({ success: false, message: `Item ${item.name || item.foodItemId} is unavailable` });
      }
      const qty = Number(item.quantity) || 1;
      totalAmount += Number(foodItem.cost) * qty;
      orderItems.push({ foodItemId: foodItem.id, name: foodItem.name, cost: Number(foodItem.cost), quantity: qty });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });
    if (Number(wallet.balance) < totalAmount) {
      return res.status(400).json({ success: false, message: `Insufficient balance. Required: ₦${totalAmount.toLocaleString()}, Balance: ₦${Number(wallet.balance).toLocaleString()}` });
    }

    const vendor = await prisma.user.findUnique({ where: { email: 'cafeteria@crawforduniversity.edu.ng' } });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const shortCode = generateShortCode();
    const expiresAt = new Date(Date.now() + ORDER_TTL_MINUTES * 60 * 1000);

    const order = await prisma.paymentOrder.create({
      data: {
        studentId: user.id,
        vendorId: vendor.id,
        items: orderItems as any,
        totalAmount,
        shortCode,
        status: 'pending',
        expiresAt,
      },
    });

    const qrData = generateQRData(order.id, shortCode);
    await prisma.paymentOrder.update({ where: { id: order.id }, data: { qrCode: qrData } });

    await logActivity({ actorId: user.id, actorEmail: user.email, action: 'CREATE_ORDER', target: order.id, metadata: { totalAmount, items: orderItems }, ip: req.ip });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        qrCode: qrData,
        shortCode,
        totalAmount,
        expiresAt: expiresAt.toISOString(),
        items: orderItems,
      },
    });
  } catch (e) { next(e); }
});

/** GET /api/v1/orders/:id — get order status */
orderRouter.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const order = await prisma.paymentOrder.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.status === 'pending' && new Date() > order.expiresAt) {
      await prisma.paymentOrder.update({ where: { id: order.id }, data: { status: 'expired' } });
      order.status = 'expired';
    }

    res.json({ success: true, data: order });
  } catch (e) { next(e); }
});

/** POST /api/v1/orders/confirm — vendor confirms payment with short code */
orderRouter.post('/confirm', authenticate, authorize('vendor'), async (req: AuthRequest, res, next) => {
  try {
    const { shortCode } = req.body;
    if (!shortCode) return res.status(400).json({ success: false, message: 'Short code required' });

    const order = await prisma.paymentOrder.findFirst({ where: { shortCode: shortCode.toUpperCase(), status: 'pending' } });
    if (!order) return res.status(404).json({ success: false, message: 'Invalid or already processed order' });

    if (new Date() > order.expiresAt) {
      await prisma.paymentOrder.update({ where: { id: order.id }, data: { status: 'expired' } });
      return res.status(400).json({ success: false, message: 'Order has expired. Student must create a new order.' });
    }

    const studentWallet = await prisma.wallet.findUnique({ where: { userId: order.studentId } });
    if (!studentWallet) return res.status(404).json({ success: false, message: 'Student wallet not found' });

    const amount = Number(order.totalAmount);
    if (Number(studentWallet.balance) < amount) {
      await prisma.paymentOrder.update({ where: { id: order.id }, data: { status: 'failed' } });
      return res.status(400).json({ success: false, message: 'Student has insufficient balance' });
    }

    const newStudentBalance = Number(studentWallet.balance) - amount;
    await prisma.wallet.update({ where: { userId: order.studentId }, data: { balance: newStudentBalance } });

    const vendorWallet = await prisma.wallet.findUnique({ where: { userId: order.vendorId } });
    const newVendorBalance = vendorWallet ? Number(vendorWallet.balance) + amount : amount;
    if (vendorWallet) {
      await prisma.wallet.update({ where: { userId: order.vendorId }, data: { balance: newVendorBalance } });
    }

    const student = await prisma.user.findUnique({ where: { id: order.studentId } });

    const tx = await prisma.transaction.create({
      data: {
        studentId: order.studentId,
        vendorId: order.vendorId,
        vendorName: 'The Cafeteria',
        type: 'debit',
        gross: amount,
        levy: 0,
        vendorPayout: amount,
        balanceAfter: newStudentBalance,
        status: 'success',
        reference: `ORDER-${order.id.slice(0, 8)}`,
        hostel: student?.hostel,
        level: student?.level,
      },
    });

    await prisma.paymentOrder.update({ where: { id: order.id }, data: { status: 'confirmed', confirmedAt: new Date() } });

    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'CONFIRM_PAYMENT', target: order.id, metadata: { amount, studentId: order.studentId }, ip: req.ip });

    res.json({ success: true, message: `Payment of ₦${amount.toLocaleString()} confirmed`, data: { transaction: tx, newStudentBalance, newVendorBalance } });
  } catch (e) { next(e); }
});

/** POST /api/v1/orders/cancel — student cancels pending order */
orderRouter.post('/cancel/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const order = await prisma.paymentOrder.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.studentId !== req.user!.sub) return res.status(403).json({ success: false, message: 'Not your order' });
    if (order.status !== 'pending') return res.status(400).json({ success: false, message: 'Order already processed' });

    await prisma.paymentOrder.update({ where: { id: order.id }, data: { status: 'cancelled' } });
    res.json({ success: true, message: 'Order cancelled' });
  } catch (e) { next(e); }
});
