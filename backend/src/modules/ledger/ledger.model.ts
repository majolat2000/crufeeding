import mongoose from 'mongoose';

/**
 * Ledger — append-only double-entry-ish log.
 * Every wallet movement creates a ledger entry with levy split fields.
 */
const ledgerSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    gross: { type: Number, required: true }, // total paid
    levy: { type: Number, required: true, default: 0 }, // 10% platform
    vendorPayout: { type: Number, required: true, default: 0 }, // 90%
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
