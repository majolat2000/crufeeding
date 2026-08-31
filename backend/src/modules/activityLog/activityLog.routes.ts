import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { listActivityLogs } from './activityLog.service.js';

export const activityLogRouter = Router();

/** GET /api/v1/activity-logs — bursar/super_admin */
activityLogRouter.get('/', authenticate, async (_req, res, next) => {
  try {
    const logs = await listActivityLogs(100);
    res.json({ success: true, data: logs });
  } catch (e) { next(e); }
});
