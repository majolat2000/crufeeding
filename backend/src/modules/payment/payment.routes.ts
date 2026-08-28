import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { processPayment } from './payment.service.js';
import { listLedger } from '../ledger/ledger.service.js';

export const paymentRouter = Router();

/**
 * POST /api/v1/payments/qr — authenticated student pays via QR
 * Body: { studentId, vendorId, amount }
 */
paymentRouter.post('/qr', authenticate, async (req, res, next) => {
  try {
    const { studentId, vendorId, amount, hostel, level } = req.body;
    const result = await processPayment({ studentId, vendorId, gross: Number(amount), hostel, level });
    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/payments/ledger — query ledger (bursar/super_admin or own studentId)
 * Query: ?studentId=&hostel=&level=&limit=&offset=
 */
paymentRouter.get('/ledger', authenticate, async (req, res, next) => {
  try {
    const { studentId, hostel, level, limit, offset } = req.query as any;
    const result = await listLedger({ studentId, hostel, level, limit: limit ? +limit : undefined, offset: offset ? +offset : undefined });
    res.json({ success: true, ...result });
  } catch (e) {
    next(e);
  }
});
