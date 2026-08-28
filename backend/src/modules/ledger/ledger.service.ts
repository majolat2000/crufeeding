import { Ledger } from './ledger.model.js';

/**
 * Query ledger with pagination + filters (hostel, level, date range).
 * Used by web dashboard and mobile Transactions.
 */
export async function listLedger(params: { studentId?: string; hostel?: string; level?: string; limit?: number; offset?: number }) {
  const { studentId, hostel, level, limit = 20, offset = 0 } = params;
  const filter: any = {};
  if (studentId) filter.studentId = studentId;
  if (hostel) filter.hostel = hostel;
  if (level) filter.level = level;
  const [rows, total] = await Promise.all([
    Ledger.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit),
    Ledger.countDocuments(filter),
  ]);
  return { rows, total };
}

export async function createLedgerEntry(data: any) {
  return Ledger.create(data);
}
