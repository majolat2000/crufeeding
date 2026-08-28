import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';
import type { Role } from '../types/index.js';

/**
 * RBAC — restrict route to allowed roles.
 * Usage: router.get('/admins', authenticate, authorize('super_admin'), handler)
 *
 * Roles:
 * - super_admin: full access (admin CRUD, hostel/level config, levy settings)
 * - bursar: financial ops (wallet top-up approval, ledger views)
 * - hostel_admin: scoped to assigned hostel
 * - student: mobile wallet + payments only
 */
export function authorize(...allowed: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of [${allowed.join(', ')}], have ${req.user.role}`,
      });
    }
    next();
  };
}

// Convenience aliases
export const requireSuperAdmin = authorize('super_admin');
export const requireBursar = authorize('super_admin', 'bursar');
