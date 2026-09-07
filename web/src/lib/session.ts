/**
 * Academic Session automation — Nigeria WAT (GMT+1)
 * Base: 2025/2026, auto-rollover every Oct 1st.
 * After Oct 1, 2025 => 2025/2026
 * After Oct 1, 2026 => 2026/2027
 * etc.
 */
export function getCurrentSession(date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11, Oct = 9
  const startYear = month >= 9 ? year : year - 1;
  return `${startYear}/${startYear + 1}`;
}

export function getSessionForDate(d: Date) { return getCurrentSession(d); }
