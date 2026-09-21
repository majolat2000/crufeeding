import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';
import type { Role } from '../types/index.js';

/**
 * RBAC — restrict route to allowed roles.
 * Bursar is the head role with full admin access.
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

// Convenience alias — bursar is the head role
export const requireBursar = authorize('bursar');
