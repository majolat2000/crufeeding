'use client';
import { useState, useEffect } from 'react';
import { fundValidStudents, fundSelective, getConfig, getUsers } from '@/lib/api';

type Sub = { id: string; email: string; fullname: string; matricNo?: string; role: string; mealBreakfast: boolean; mealLunch: boolean; mealDinner: boolean; wallet?: { balance: number } };

export default function FundWalletsPage() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [rates, setRates] = useState({ breakfast: 1500, lunch: 2000, dinner: 1500, allThree: 5000 });
  const [mode, setMode] = useState<'all' | 'selective'>('all');
  const [subscribers, setSubscribers] = useState<Sub[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
    getUsers().then((r) => {
      const subs = (r.data ?? []).filter((u: any) => u.role === 'subscriber');
      setSubscribers(subs);
    }).catch(() => {});
  }, []);

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function selectAll() {
    setSelected(new Set(subscribers.map(s => s.id)));
  }

  async function fund() {
    if (days < 1 || days > 31) { setMsg('Days must be 1-31'); return; }
    setLoading(true);
    try {
      let r;
      if (mode === 'selective' && selected.size > 0) {
        r = await fundSelective(days, Array.from(selected));
      } else {
        r = await fundValidStudents(days);
      }
      setMsg(r.message || `Funded ${days} day(s) successfully`);
    } catch (e: any) { setMsg(e.message); } finally { setLoading(false); }
  }

  const fundCount = mode === 'selective' ? selected.size : subscribers.length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Fund Wallets</h1>

      {/* Mode selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Funding Mode</h2>
        <div className="mt-3 flex gap-3">
          <button onClick={() => setMode('all')} className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'all' ? 'bg-[#1A153B] text-white' : 'bg-gray-100 text-gray-700'}`}>
            Fund All Active Subscribers ({subscribers.length})
          </button>
          <button onClick={() => setMode('selective')} className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'selective' ? 'bg-[#1A153B] text-white' : 'bg-gray-100 text-gray-700'}`}>
            Fund Select Subscribers ({selected.size} selected)
          </button>
        </div>
      </div>

      {/* Subscriber list (selective mode) */}
      {mode === 'selective' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1A153B]">Select Subscribers</h2>
            <button onClick={selectAll} className="text-xs text-[#1A153B] font-bold underline">Select All</button>
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {subscribers.map(s => (
              <label key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${selected.has(s.id) ? 'border-[#1A153B] bg-gray-50' : 'border-gray-200'}`}>
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} className="accent-[#1A153B]" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A153B]">{s.fullname || s.email}</p>
                  <p className="text-xs text-gray-500">{s.matricNo || '—'} &bull; {s.mealBreakfast ? 'B ' : ''}{s.mealLunch ? 'L ' : ''}{s.mealDinner ? 'D ' : ''}</p>
                </div>
                <span className="text-sm font-bold">₦{Number(s.wallet?.balance ?? 0).toLocaleString()}</span>
              </label>
            ))}
            {subscribers.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No subscribers found</p>}
          </div>
        </div>
      )}

      {/* Funding calculator */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-700">Select days to fund (1-31). Wallets credited per active plan:</p>
        <ul className="text-xs text-gray-600 list-disc pl-5 mt-2">
          <li>Breakfast: ₦{rates.breakfast.toLocaleString()}/day</li>
          <li>Lunch: ₦{rates.lunch.toLocaleString()}/day</li>
          <li>Dinner: ₦{rates.dinner.toLocaleString()}/day</li>
          <li>All Three: ₦{rates.allThree.toLocaleString()}/day</li>
        </ul>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Days</label>
          <input type="number" min={1} max={31} value={days} onChange={e => setDays(Math.min(31, Math.max(1, Number(e.target.value) || 1)))} className="border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm" />
          <span className="text-xs text-gray-500">max 31</span>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-gray-50 rounded-xl p-2">Breakfast <b>₦{(rates.breakfast * days).toLocaleString()}</b></div>
          <div className="bg-gray-50 rounded-xl p-2">Lunch <b>₦{(rates.lunch * days).toLocaleString()}</b></div>
          <div className="bg-gray-50 rounded-xl p-2">Dinner <b>₦{(rates.dinner * days).toLocaleString()}</b></div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2">All Three <b>₦{(rates.allThree * days).toLocaleString()}</b></div>
        </div>
        <button onClick={fund} disabled={loading || (mode === 'selective' && selected.size === 0)} className="mt-4 bg-[#1A153B] text-white px-6 py-3 rounded-xl font-bold disabled:opacity-60">
          {loading ? 'Funding...' : `Fund ${mode === 'selective' ? `${selected.size} Selected` : 'All Valid Students'} — ${days} day(s)`}
        </button>
        <p className="text-xs text-gray-500 mt-2">Only The Cafeteria &bull; 100% direct payout &bull; Activity logged</p>
        {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">{msg}</p>}
      </div>
    </div>
  );
}
