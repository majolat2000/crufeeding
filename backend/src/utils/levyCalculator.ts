import type { LevySplit } from '../types/index.js';

/**
 * @deprecated Levy removed — direct 100% payout to vendor.
 * This helper now always returns levy=0 and vendorPayout=gross to keep call-sites working
 * while the levy concept is sunset. New code should not call it — just use gross directly.
 */
export function calculateLevySplit(gross: number, _rate = 0): LevySplit {
  if (gross <= 0) throw new Error('Gross amount must be positive');
  return { gross, levy: 0, vendorPayout: gross };
}

/** Direct payout — 100% to vendor, no institutional cut */
export function calculateDirectPayout(gross: number) {
  if (gross <= 0) throw new Error('Gross amount must be positive');
  return { gross, vendorPayout: gross };
}
