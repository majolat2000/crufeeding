'use client';
import { useState } from 'react';

/**
 * Transactions & Logs Table — searchable, Filter Table, date range, balances.
 */
const ROWS = [
  { id: 'TX-88421', student: 'LCU/UG/20/17109', merchant: 'Burger & Bread', amount: '₦50', balance: '₦70.00', date: '2026-08-28 12:34' },
  { id: 'TX-88420', student: 'LCU/UG/20/17122', merchant: 'Tasty Vine Kitchen', amount: '₦10', balance: '₦45.00', date: '2026-08-28 09:12' },
  { id: 'TX-88419', student: 'LCU/UG/20/17109', merchant: 'Cresta', amount: '₦50', balance: '₦75.00', date: '2026-08-27 19:45' },
];

export default function TransactionsPage() {
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const filtered = ROWS.filter((r) => !query || `${r.student} ${r.merchant} ${r.id}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Filter Table • date range, balances • 100% to vendor</p>
        </div>
        <button className="border border-gray-200 bg-white px-4 py-2 rounded-xl text-sm font-semibold">Export CSV</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Filter Table</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student, merchant, ID..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm" />
        </div>
        <div className="text-xs text-gray-500">Start: ₦75.00 • End: ₦20.00 • {filtered.length} rows</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
              <tr><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Student</th><th className="text-left px-4 py-3">Merchant</th><th className="text-right px-4 py-3">Amount (100% to vendor)</th><th className="text-right px-4 py-3">Balance</th><th className="text-left px-4 py-3">ID</th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs text-gray-500">{r.date}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.student}</td>
                  <td className="px-4 py-3 font-semibold text-[#1A153B]">{r.merchant}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#4338CA]">{r.amount}</td>
                  <td className="px-4 py-3 text-right font-semibold">{r.balance}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
