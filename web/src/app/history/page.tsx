'use client';
import { useState, useEffect } from 'react';
import { getTransactions } from '@/lib/api';

type Tx = { id: string; studentId: string; vendorName: string; type: string; gross: number; reference: string; status: string; createdAt: string; student?: { email: string; fullname: string; matricNo: string } };

export default function HistoryPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions('?type=credit&limit=200')
      .then(r => setTxs(r.data || []))
      .catch(() => setTxs([]))
      .finally(() => setLoading(false));
  }, []);

  const totalFunded = txs.reduce((s, t) => s + Number(t.gross), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">History</h1>
      <p className="text-sm text-gray-500">Funding records only &bull; Credits to subscriber wallets</p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Total Funded</p>
            <p className="text-2xl font-extrabold text-emerald-800 mt-2">₦{totalFunded.toLocaleString()}</p>
          </div>
          <div className="bg-[#F4F5F7] rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Funding Records</p>
            <p className="text-2xl font-extrabold text-[#1A153B] mt-2">{txs.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading funding history...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Matric</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Reference</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {txs.map(t => (
                <tr key={t.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1A153B]">{t.student?.fullname || '—'}</p>
                    <p className="text-xs text-gray-500">{t.student?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{t.student?.matricNo || '—'}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-700">₦{Number(t.gross).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{t.reference}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">{t.status}</span>
                  </td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No funding records found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
