/**
 * Academic Session automation
 * Default: 2026/2027, auto-rollover every Oct 1st
 * e.g. before 2027-10-01 => 2026/2027, after => 2027/2028
 */
export function getCurrentSession(date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  // Oct = 9
  // If month >= Oct (9), session starts this year; else previous year
  const startYear = month >= 9 ? year : year - 1;
  // But clamp to start at 2026/2027 base
  const baseStart = 2026;
  const effectiveStart = Math.max(startYear, baseStart);
  // If we are before 2026-10-01, still return 2026/2027
  if (effectiveStart < baseStart) return '2026/2027';
  return `${effectiveStart}/${effectiveStart + 1}`;
}

export function getSessionForDate(d: Date) { return getCurrentSession(d); }
