import { calculateLevySplit } from '../../utils/levyCalculator.js';
import { debit } from '../wallet/wallet.service.js';
import { createLedgerEntry } from '../ledger/ledger.service.js';
import { env } from '../../config/env.js';

/**
 * Process a QR payment — core business logic.
 * 1. Validate amount, vendor
 * 2. Calculate 10% levy split (single source: levyCalculator)
 * 3. Atomically debit student wallet
 * 4. Append ledger entry with levy/vendorPayout
 * 5. (async) queue vendor settlement & platform remittance
 */
export async function processPayment(params: { studentId: string; vendorId: string; gross: number; hostel?: string; level?: string }) {
  const { studentId, vendorId, gross, hostel, level } = params;
  if (!vendorId) throw Object.assign(new Error('vendorId required'), { statusCode: 400 });
  if (gross < 100) throw Object.assign(new Error('Minimum payment ₦100'), { statusCode: 400 });

  const split = calculateLevySplit(gross, env.levyRate);
  const wallet = await debit(studentId, gross);

  const ledger = await createLedgerEntry({
    studentId,
    vendorId,
    type: 'debit',
    gross: split.gross,
    levy: split.levy,
    vendorPayout: split.vendorPayout,
    balanceAfter: wallet.balance,
    status: 'success',
    hostel,
    level,
  });

  return { wallet, ledger, split };
}
