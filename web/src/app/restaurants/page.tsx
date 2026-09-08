'use client';
import { useState, useEffect } from 'react';
import { getCafeteriaTransactions, refundTransaction } from '@/lib/api';

type Tx = {
  id: string; studentId: string; vendorId: string; vendorName: string;
  type: string; gross: number; balanceAfter: number; reference: string;
  status: string; createdAt: string;
  student?: { id: string; email: string; fullname: string; matricNo: string };
};

export default function CafeteriaPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [refundId, setRefundId] = useState<string | null>(null);

  useEffect(() => { loadTxs(); }, []);

  async function loadTxs(q = '') {
    setLoading(true);
    try {
      const params = q ? `&search=${encodeURIComponent(q)}` : '';
      const r = await getCafeteriaTransactions(params);
      setTxs(r.data || []);
      setTotal(r.total || 0);
    } catch { setTxs([]); } finally { setLoading(false); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadTxs(search);
  }

  async function handleRefund(id: string) {
    if (!confirm('Process refund? This will credit the student wallet.')) return;
    setRefundId(id);
    try {
      const r = await refundTransaction(id);
      setMsg(r.message || 'Refund processed');
      loadTxs(search);
    } catch (e: any) { setMsg(e.message); } finally { setRefundId(null); }
  }

  const totalPurchases = txs.filter(t => t.type === 'debit').reduce((s, t) => s + Number(t.gross), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Cafeteria</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">The Cafeteria</h2>
        <p className="text-xs text-gray-500">Purchase history from PostgreSQL &bull; 100% direct payout</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="bg-[#F4F5F7] rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Purchases</p>
            <p className="text-2xl font-extrabold text-[#1A153B]">{txs.length.toLocaleString()}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Total Value</p>
            <p className="text-sm font-bold text-emerald-800 mt-2">₦{totalPurchases.toLocaleString()}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Merchant</p>
            <p className="text-sm font-bold text-indigo-800 mt-2">The Cafeteria</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email, matric, name, reference..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
          />
          <button type="submit" className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-bold">Search</button>
        </form>
      </div>

      {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2">{msg}</p>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading cafeteria transactions...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Matric</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-right px-4 py-3">Balance</th>
                <th className="text-left px-4 py-3">Reference</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {txs.map(t => (
                <tr key={t.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1A153B]">{t.student?.fullname || '—'}</p>
                    <p className="text-xs text-gray-500">{t.student?.email || t.studentId.slice(0, 8)}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{t.student?.matricNo || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.type === 'debit' ? 'bg-red-100 text-red-700' : t.type === 'refund' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">₦{Number(t.gross).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500">₦{Number(t.balanceAfter).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{t.reference}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {t.type === 'debit' && (
                      <button
                        onClick={() => handleRefund(t.id)}
                        disabled={refundId === t.id}
                        className="text-red-600 font-bold text-xs disabled:opacity-50"
                      >
                        {refundId === t.id ? 'Refunding...' : 'Refund'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-gray-500">No cafeteria transactions found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
