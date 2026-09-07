import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const adminRouter = Router();

/** GET /api/v1/admin — list all admin users */
adminRouter.get('/', authenticate, authorize('super_admin', 'bursar'), async (_req, res, next) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['super_admin', 'bursar'] } },
      select: { id: true, email: true, fullname: true, role: true, verified: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: admins });
  } catch (e) { next(e); }
});

/** PUT /api/v1/admin/:id/role — change admin role */
adminRouter.put('/:id/role', authenticate, authorize('super_admin'), async (req: AuthRequest, res, next) => {
  try {
    const { role } = req.body;
    if (!['super_admin', 'bursar', 'user'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { role }, select: { id: true, email: true, role: true, fullname: true } });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'UPDATE_ROLE', target: user.email, metadata: { role }, ip: req.ip });
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
});

/** DELETE /api/v1/admin/:id */
adminRouter.delete('/:id', authenticate, authorize('super_admin'), async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'super_admin') {
      const count = await prisma.user.count({ where: { role: 'super_admin' } });
      if (count <= 1) return res.status(400).json({ success: false, message: 'Cannot delete the last super admin' });
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'DELETE_USER', target: user.email, ip: req.ip });
    res.json({ success: true, message: 'User deleted' });
  } catch (e) { next(e); }
});

/** GET /api/v1/admin/dashboard — real metrics */
adminRouter.get('/dashboard', authenticate, authorize('super_admin', 'bursar'), async (_req, res, next) => {
  try {
    const now = new Date();
    const watOffset = 1 * 60 * 60 * 1000;
    const watNow = new Date(now.getTime() + watOffset);
    const month = watNow.getMonth() + 1;
    const year = watNow.getFullYear();
    let sessionStart: Date;
    if (month >= 10) {
      sessionStart = new Date(year, 9, 1);
    } else {
      sessionStart = new Date(year - 1, 9, 1);
    }
    const monthStart = new Date(watNow.getFullYear(), watNow.getMonth(), 1);
    const weekAgo = new Date(watNow.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalSubscribers, newUsersWeek, totalDisbursement, monthlyTransactions, cafeteriaPurchases] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'subscriber' } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.transaction.aggregate({ where: { type: 'credit', createdAt: { gte: sessionStart } }, _sum: { gross: true } }),
      prisma.transaction.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.transaction.count({ where: { vendorId: 'CAFETERIA', createdAt: { gte: monthStart } } }),
    ]);

    const subscribers = await prisma.user.findMany({ where: { role: 'subscriber' }, select: { mealBreakfast: true, mealLunch: true, mealDinner: true } });
    const breakdown = {
      breakfastOnly: 0, lunchOnly: 0, dinnerOnly: 0,
      breakfastLunch: 0, breakfastDinner: 0, lunchDinner: 0,
      allThree: 0,
    };
    for (const s of subscribers) {
      const b = s.mealBreakfast, l = s.mealLunch, d = s.mealDinner;
      const count = (b ? 1 : 0) + (l ? 1 : 0) + (d ? 1 : 0);
      if (count === 3) breakdown.allThree++;
      else if (count === 2) {
        if (b && l) breakdown.breakfastLunch++;
        else if (b && d) breakdown.breakfastDinner++;
        else if (l && d) breakdown.lunchDinner++;
      } else if (count === 1) {
        if (b) breakdown.breakfastOnly++;
        else if (l) breakdown.lunchOnly++;
        else if (d) breakdown.dinnerOnly++;
      }
    }

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSubscribers,
        newUsersWeek,
        totalDisbursement: Number(totalDisbursement._sum.gross ?? 0),
        monthlyTransactions,
        cafeteriaPurchases,
        subscriberBreakdown: breakdown,
      },
    });
  } catch (e) { next(e); }
});

/** GET /api/v1/admin/users — list all users with wallet + meal info */
adminRouter.get('/users', authenticate, authorize('super_admin', 'bursar'), async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, fullname: true, matricNo: true, role: true, level: true, hostel: true,
        mealBreakfast: true, mealLunch: true, mealDinner: true, verified: true, createdAt: true,
        wallet: { select: { balance: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: users });
  } catch (e) { next(e); }
});

/** PUT /api/v1/admin/users/:id — update user */
adminRouter.put('/users/:id', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    const { role, level, mealBreakfast, mealLunch, mealDinner, hostel, verified } = req.body;
    const data: any = {};
    if (role !== undefined) data.role = role;
    if (level !== undefined) data.level = level;
    if (mealBreakfast !== undefined) data.mealBreakfast = mealBreakfast;
    if (mealLunch !== undefined) data.mealLunch = mealLunch;
    if (mealDinner !== undefined) data.mealDinner = mealDinner;
    if (hostel !== undefined) data.hostel = hostel;
    if (verified !== undefined) data.verified = verified;
    const user = await prisma.user.update({ where: { id: req.params.id }, data, select: { id: true, email: true, role: true, fullname: true } });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'UPDATE_USER', target: user.email, metadata: data, ip: req.ip });
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
});

/** POST /api/v1/admin/hostels */
adminRouter.post('/hostels', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    const { name, capacity } = req.body;
    const hostel = await prisma.hostel.create({ data: { name, capacity: Number(capacity) } });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'CREATE_HOSTEL', target: name, metadata: req.body, ip: req.ip });
    res.status(201).json({ success: true, data: hostel });
  } catch (e) { next(e); }
});

/** DELETE /api/v1/admin/hostels/:id */
adminRouter.delete('/hostels/:id', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    await prisma.hostel.delete({ where: { id: req.params.id } });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'DELETE_HOSTEL', target: req.params.id, ip: req.ip });
    res.json({ success: true, message: 'Hostel deleted' });
  } catch (e) { next(e); }
});

/** POST /api/v1/admin/levels */
adminRouter.post('/levels', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    const { name, cap, plan } = req.body;
    const level = await prisma.level.create({ data: { name, cap: Number(cap), plan } });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'CREATE_LEVEL', target: name, metadata: req.body, ip: req.ip });
    res.status(201).json({ success: true, data: level });
  } catch (e) { next(e); }
});

/** DELETE /api/v1/admin/levels/:id */
adminRouter.delete('/levels/:id', authenticate, authorize('super_admin', 'bursar'), async (req: AuthRequest, res, next) => {
  try {
    await prisma.level.delete({ where: { id: req.params.id } });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'DELETE_LEVEL', target: req.params.id, ip: req.ip });
    res.json({ success: true, message: 'Level deleted' });
  } catch (e) { next(e); }
});
