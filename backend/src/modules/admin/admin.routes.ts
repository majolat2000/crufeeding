import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

export const adminRouter = Router();

/**
 * Admin management — super_admin only
 * In production, persist to User collection + emit activity log.
 */
const ADMINS = [
  { id: '1', name: 'Dr. B. Alao', email: 'bursary@crawford.edu.ng', role: 'super_admin', status: 'Active' },
  { id: '2', name: 'Mrs. K. Ojo', email: 'k.ojo@crawford.edu.ng', role: 'bursar', status: 'Active' },
];

adminRouter.get('/', authenticate, authorize('super_admin', 'bursar'), (_req, res) => {
  res.json({ success: true, data: ADMINS });
});

adminRouter.post('/invite', authenticate, authorize('super_admin'), (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) return res.status(400).json({ success: false, message: 'email and role required' });
  // TODO: create invite, send email, log to activity_logs
  res.status(201).json({ success: true, message: `Invite sent to ${email} as ${role}` });
});

adminRouter.delete('/:id', authenticate, authorize('super_admin'), (req, res) => {
  // TODO: soft-delete, log
  res.json({ success: true, message: `Admin ${req.params.id} removed` });
});

// Hostel & Level settings — super_admin + bursar can edit, hostel_admin read-only
adminRouter.get('/hostels', authenticate, (_req, res) => {
  res.json({ success: true, data: [{ id: 'faith-hall', name: 'Faith Hall', capacity: 400 }] });
});
adminRouter.put('/hostels/:id', authenticate, authorize('super_admin', 'bursar'), (req, res) => {
  res.json({ success: true, message: `Hostel ${req.params.id} updated`, data: req.body });
});
adminRouter.get('/levels', authenticate, (_req, res) => {
  res.json({ success: true, data: ['100', '200', '300', '400', '500'] });
});
