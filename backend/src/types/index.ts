/**
 * Shared domain types.
 */
export type Role = 'super_admin' | 'bursar' | 'hostel_admin' | 'student';

export interface JwtPayload {
  sub: string; // user id
  role: Role;
  email: string;
}

export interface LevySplit {
  gross: number;
  levy: number; // 10% platform
  vendorPayout: number; // 90%
}
