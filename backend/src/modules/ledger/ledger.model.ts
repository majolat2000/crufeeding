import mongoose from 'mongoose';

/**
 * Ledger — append-only log. Levy fields sunset — vendor receives 100% of gross.
 * levy always 0, vendorPayout === gross. Kept for migration but new rows use direct payout.
 */
const ledgerSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    gross: { type: Number, required: true }, // total paid — 100% to vendor
    levy: { type: Number, required: false, default: 0 }, // deprecated, always 0
    vendorPayout: { type: Number, required: true }, // equals gross
    balanceAfter: { type: Number, required: true },
    reference: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ['success', 'pending', 'failed'], default: 'success' },
    hostel: String,
    level: String,
  },
  { timestamps: true }
);

ledgerSchema.index({ createdAt: -1 });

export const Ledger = mongoose.model('Ledger', ledgerSchema);
