'use client';
import { useState, useEffect } from 'react';
import { getTransactions } from '@/lib/api';

type Tx = { id: string; studentId: string; vendorName: string; type: string; gross: number; balanceAfter: number; status: string; reference?: string; createdAt: string };

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions('?limit=100')
      .then((r) => { setTxs(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = txs.filter(r => {
    if (!query) return true;
    const q = query.toLowerCase();
    return `${r.studentId} ${r.vendorName} ${r.id} ${r.reference || ''}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Real ledger-backed transactions &bull; 100% to vendor</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search student, merchant, ID..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading transactions from database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Student</th>
                  <th className="text-left px-4 py-3">Vendor</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-right px-4 py-3">Balance After</th>
                  <th className="text-left px-4 py-3">Reference</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs">{r.studentId}</td>
                    <td className="px-4 py-3 font-semibold text-[#1A153B]">{r.vendorName || r.vendorId}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.type === 'credit' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#4338CA]">\u20A6{Number(r.gross).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold">\u20A6{Number(r.balanceAfter).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.reference || '\u2014'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-gray-500">No transactions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* XpressPayments placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">External Funding (XpressPayments)</p>
        <p className="text-xs text-gray-400 mt-1">Placeholder for upcoming public/private API key integration for external wallet funding.</p>
      </div>
    </div>
  );
}
