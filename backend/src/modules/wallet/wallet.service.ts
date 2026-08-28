import { Wallet } from './wallet.model.js';

/**
 * Wallet service — balance reads, top-ups, and debits with ledger hooks.
 */
export async function getWallet(studentId: string) {
  const wallet = await Wallet.findOne({ studentId });
  if (!wallet) throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  return wallet;
}

export async function topUp(studentId: string, amount: number) {
  if (amount <= 0) throw Object.assign(new Error('Amount must be positive'), { statusCode: 400 });
  const wallet = await Wallet.findOneAndUpdate({ studentId }, { $inc: { balance: amount } }, { new: true, upsert: false });
  if (!wallet) throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  return wallet;
}

export async function debit(studentId: string, amount: number) {
  // Atomic check: only debit if balance >= amount
  const wallet = await Wallet.findOneAndUpdate(
    { studentId, balance: { $gte: amount } },
    { $inc: { balance: -amount } },
    { new: true }
  );
  if (!wallet) throw Object.assign(new Error('Insufficient balance'), { statusCode: 400 });
  return wallet;
}
