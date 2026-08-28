import mongoose from 'mongoose';

/**
 * Wallet — one per student. Balance in kobo (integer) or naira (number with 2 decimals).
 * We store as number (naira) for readability; use transactions for concurrency.
 */
const walletSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, index: true },
    matricNo: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0, min: 0 },
    hostel: { type: String, required: true },
    level: { type: String, required: true },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model('Wallet', walletSchema);
