'use client';
import { useState } from 'react';

export default function RestaurantsPage() {
  const [range, setRange] = useState<'current' | 'previous' | 'all'>('current');
  const count = range==='current' ? 3842 : range==='previous' ? 3120 : 6962;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Restaurants</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">The Cafeteria</h2>
        <p className="text-xs text-gray-500">Single cafeteria view • 100% direct payout</p>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-[#F4F5F7] rounded-xl p-4"><p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Purchases</p><p className="text-2xl font-extrabold text-[#1A153B]">{count.toLocaleString()}</p><p className="text-xs text-gray-500">{range} session</p></div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Session</p><p className="text-sm font-bold text-emerald-800 mt-2">{range}</p></div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4"><p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Merchant</p><p className="text-sm font-bold text-indigo-800 mt-2">The Cafeteria</p></div>
        </div>
        <div className="mt-6 flex gap-2">
          <input placeholder="Deep search transactions (email, matric, date, amount)..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          <select value={range} onChange={e=>setRange(e.target.value as any)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
            <option value="current">Current (2026/2027)</option>
            <option value="previous">Previous</option>
            <option value="all">All sessions</option>
          </select>
        </div>
        <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-600">Querying PostgreSQL transactions where vendor='The Cafeteria' and session={range} • indexed by createdAt/vendorId</div>
      </div>
    </div>
  );
}
