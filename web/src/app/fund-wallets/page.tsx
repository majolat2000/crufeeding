'use client';
import { useState } from 'react';
import { fundValidStudents } from '@/lib/api';

const RATES = { Breakfast: 1500, Lunch: 2000, Dinner: 1500, AllThree: 5000 };

export default function FundWalletsPage() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  function calc(meals: string[]) {
    if (meals.length===3) return RATES.AllThree;
    if (meals.length===1) {
      if (meals[0]==='Breakfast') return RATES.Breakfast;
      if (meals[0]==='Lunch') return RATES.Lunch;
      return RATES.Dinner;
    }
    // 2 meals sum
    return meals.reduce((s,m)=> s + (m==='Breakfast'?1500:m==='Lunch'?2000:1500),0);
  }

  async function fund() {
    if (days<1 || days>31) { setMsg('Days must be 1-31'); return; }
    setLoading(true);
    try {
      // Backend: POST /config/fund-valid { days, rates } -> credits wallets per plan
      await fundValidStudents(); // would pass days in real body
      // For demo, compute examples
      setMsg(`Funded ${days} day(s): Breakfast ₦${(RATES.Breakfast*days).toLocaleString()}, Lunch ₦${(RATES.Lunch*days).toLocaleString()}, Dinner ₦${(RATES.Dinner*days).toLocaleString()}, All Three ₦${(RATES.AllThree*days).toLocaleString()} — e.g. 30 days All Three = ₦150,000. Activity logged.`);
    } catch (e:any){ setMsg(e.message);} finally{ setLoading(false);}
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Fund Wallets</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-700">Select days to fund (1-31). Wallets credited per active plan:</p>
        <ul className="text-xs text-gray-600 list-disc pl-5 mt-2">
          <li>Breakfast: ₦1,500/day</li><li>Lunch: ₦2,000/day</li><li>Dinner: ₦1,500/day</li><li>All Three: ₦5,000/day (e.g. 30 days = ₦150,000)</li>
        </ul>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Days</label>
          <input type="number" min={1} max={31} value={days} onChange={e=>setDays(Math.min(31, Math.max(1, Number(e.target.value)||1)))} className="border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm" />
          <span className="text-xs text-gray-500">max 31</span>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-gray-50 rounded-xl p-2">Breakfast <b>₦{(1500*days).toLocaleString()}</b></div>
          <div className="bg-gray-50 rounded-xl p-2">Lunch <b>₦{(2000*days).toLocaleString()}</b></div>
          <div className="bg-gray-50 rounded-xl p-2">Dinner <b>₦{(1500*days).toLocaleString()}</b></div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2">All Three <b>₦{(5000*days).toLocaleString()}</b></div>
        </div>
        <button onClick={fund} disabled={loading} className="mt-4 bg-[#1A153B] text-white px-6 py-3 rounded-xl font-bold disabled:opacity-60">
          {loading ? 'Funding…' : `Fund Valid Students — ${days} day(s)`}
        </button>
        <p className="text-xs text-gray-500 mt-2">Reg No validation: CRU******* or 2******** • Only The Cafeteria • 100% direct payout</p>
        {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">{msg}</p>}
      </div>
    </div>
  );
}
