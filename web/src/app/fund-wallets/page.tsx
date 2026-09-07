'use client';
import { useState, useEffect } from 'react';
import { fundValidStudents, getConfig } from '@/lib/api';

export default function FundWalletsPage() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [rates, setRates] = useState({ breakfast: 1500, lunch: 2000, dinner: 1500, allThree: 5000 });

  useEffect(() => {
    getConfig().then((r) => {
      const d = r.data ?? r;
      setRates({
        breakfast: Number(d.breakfastRate ?? 1500),
        lunch: Number(d.lunchRate ?? 2000),
        dinner: Number(d.dinnerRate ?? 1500),
        allThree: Number(d.allThreeRate ?? 5000),
      });
    }).catch(() => {});
  }, []);

  async function fund() {
    if (days < 1 || days > 31) { setMsg('Days must be 1-31'); return; }
    setLoading(true);
    try {
      const r = await fundValidStudents(days);
      setMsg(r.message || `Funded ${days} day(s) successfully`);
    } catch (e: any) { setMsg(e.message); } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Fund Wallets</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-700">Select days to fund (1-31). Wallets credited per active plan:</p>
        <ul className="text-xs text-gray-600 list-disc pl-5 mt-2">
          <li>Breakfast: \u20A6{rates.breakfast.toLocaleString()}/day</li>
          <li>Lunch: \u20A6{rates.lunch.toLocaleString()}/day</li>
          <li>Dinner: \u20A6{rates.dinner.toLocaleString()}/day</li>
          <li>All Three: \u20A6{rates.allThree.toLocaleString()}/day</li>
        </ul>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Days</label>
          <input type="number" min={1} max={31} value={days} onChange={e => setDays(Math.min(31, Math.max(1, Number(e.target.value) || 1)))} className="border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm" />
          <span className="text-xs text-gray-500">max 31</span>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-gray-50 rounded-xl p-2">Breakfast <b>\u20A6{(rates.breakfast * days).toLocaleString()}</b></div>
          <div className="bg-gray-50 rounded-xl p-2">Lunch <b>\u20A6{(rates.lunch * days).toLocaleString()}</b></div>
          <div className="bg-gray-50 rounded-xl p-2">Dinner <b>\u20A6{(rates.dinner * days).toLocaleString()}</b></div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2">All Three <b>\u20A6{(rates.allThree * days).toLocaleString()}</b></div>
        </div>
        <button onClick={fund} disabled={loading} className="mt-4 bg-[#1A153B] text-white px-6 py-3 rounded-xl font-bold disabled:opacity-60">
          {loading ? 'Funding\u2026' : `Fund Valid Students \u2014 ${days} day(s)`}
        </button>
        <p className="text-xs text-gray-500 mt-2">Only The Cafeteria &bull; 100% direct payout &bull; Activity logged</p>
        {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">{msg}</p>}
      </div>
    </div>
  );
}
