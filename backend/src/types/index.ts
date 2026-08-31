/**
 * Shared domain types.
 */
export type Role = 'super_admin' | 'bursar' | 'hostel_admin' | 'student';

export interface JwtPayload {
  sub: string; // user id
  role: Role;
  email: string;
}

/** @deprecated Levy removed — 100% direct payout to vendor. Kept for migration compat. */
export interface LevySplit {
  gross: number;
  levy: number; // always 0
  vendorPayout: number; // equals gross
}
