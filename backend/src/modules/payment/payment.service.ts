import { calculateDirectPayout } from '../../utils/levyCalculator.js';
import { debit } from '../wallet/wallet.service.js';
import { createLedgerEntry } from '../ledger/ledger.service.js';

/**
 * Process a QR payment — direct 100% payout to vendor (levy removed).
 * 1. Validate amount, vendor
 * 2. Direct payout (no levy)
 * 3. Atomically debit student wallet
 * 4. Append ledger entry (vendorPayout === gross)
 * 5. (async) queue vendor settlement
 */
export async function processPayment(params: { studentId: string; vendorId: string; gross: number; hostel?: string; level?: string }) {
  const { studentId, vendorId, gross, hostel, level } = params;
  if (!vendorId) throw Object.assign(new Error('vendorId required'), { statusCode: 400 });
  if (gross < 100) throw Object.assign(new Error('Minimum payment ₦100'), { statusCode: 400 });

  const split = calculateDirectPayout(gross);
  const wallet = await debit(studentId, gross);

  const ledger = await createLedgerEntry({
    studentId,
    vendorId,
    type: 'debit',
    gross: split.gross,
    levy: 0,
    vendorPayout: split.vendorPayout, // 100% to vendor
    balanceAfter: wallet.balance,
    status: 'success',
    hostel,
    level,
  });

  return { wallet, ledger, split };
}
