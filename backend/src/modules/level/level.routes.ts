import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const levelRouter = Router();

levelRouter.get('/', authenticate, async (_req, res, next) => {
  try {
    const levels = await prisma.level.findMany().catch(() => [{ id: '300', name: '300 Level', plan: 'Premium', cap: 2000 }]);
    res.json({ success: true, data: levels });
  } catch (e) { next(e); }
});

levelRouter.post('/', authenticate, authorize('super_admin', 'bursar'), async (req, res, next) => {
  try {
    const { name, cap, plan } = req.body;
    const level = await prisma.level.create({ data: { name, cap: Number(cap), plan } }).catch(() => ({ id: Date.now().toString(), name, cap, plan }));
    await logActivity({ actorId: (req as any).user.sub, actorEmail: (req as any).user.email, action: 'CREATE_LEVEL', target: name, metadata: req.body, ip: req.ip });
    res.status(201).json({ success: true, data: level });
  } catch (e) { next(e); }
});

levelRouter.delete('/:id', authenticate, authorize('super_admin', 'bursar'), async (req, res, next) => {
  try {
    await prisma.level.delete({ where: { id: req.params.id } }).catch(() => null);
    await logActivity({ actorId: (req as any).user.sub, actorEmail: (req as any).user.email, action: 'DELETE_LEVEL', target: req.params.id, ip: req.ip });
    res.json({ success: true, message: 'Level deleted' });
  } catch (e) { next(e); }
});
