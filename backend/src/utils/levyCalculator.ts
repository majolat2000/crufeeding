import type { LevySplit } from '../types/index.js';

/**
 * 10% third-party revenue levy — single source of truth.
 * All payment flows must use this to ensure ledger consistency.
 *
 * @param gross - total amount student pays
 * @param rate - default 0.10 from env
 */
export function calculateLevySplit(gross: number, rate = 0.10): LevySplit {
  if (gross <= 0) throw new Error('Gross amount must be positive');
  if (rate < 0 || rate > 1) throw new Error('Invalid levy rate');
  // Round to kobo (2 decimals) to avoid floating errors
  const levy = Math.round(gross * rate * 100) / 100;
  const vendorPayout = Math.round((gross - levy) * 100) / 100;
  return { gross, levy, vendorPayout };
}
