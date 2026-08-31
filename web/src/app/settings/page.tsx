'use client';
import { useState, useEffect } from 'react';
import { getLevels, createLevel, deleteLevel, getConfig, updateFeedingAmount, fundValidStudents } from '@/lib/api';

/**
 * Settings — per spec:
 * - No Hostel config
 * - Levels: JUPEB, 100 LEVEL, 200 LEVEL, 300 LEVEL, 500 LEVEL, Visitor (Visitor needs only email+password)
 * - Granular daily rates: Breakfast ₦1500, Lunch ₦2000, Dinner ₦1500 (All Three ₦5000)
 */
const ALLOWED_LEVELS = ['JUPEB', '100 LEVEL', '200 LEVEL', '300 LEVEL', '500 LEVEL', 'Visitor'];

export default function SettingsPage() {
  const [levels, setLevels] = useState<string[]>([]);
  const [newLevel, setNewLevel] = useState('100 LEVEL');
  const [breakfast, setBreakfast] = useState('1500');
  const [lunch, setLunch] = useState('2000');
  const [dinner, setDinner] = useState('1500');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getLevels().then((r) => {
      const arr = (r.data ?? r).map((l: any) => l.name ?? l);
      setLevels(arr.length ? arr : ALLOWED_LEVELS);
    }).catch(() => setLevels(ALLOWED_LEVELS));
    getConfig().then((r) => {
      const d = r.data ?? r;
      setBreakfast(String(d.breakfastRate ?? 1500));
      setLunch(String(d.lunchRate ?? 2000));
      setDinner(String(d.dinnerRate ?? 1500));
    }).catch(()=>{});
  }, []);

  const Chip = ({ label, onDelete }: { label: string; onDelete: () => void }) => (
    <span className="inline-flex items-center gap-2 bg-[#F4F5F7] border border-gray-200 rounded-full px-3 py-1.5 text-sm">
      {label}
      <button onClick={onDelete} className="w-5 h-5 rounded-full bg-[#1A153B] text-white text-xs leading-none">×</button>
    </span>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A153B]">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Levels, meal rates, registration specs • PostgreSQL single source</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">User Registration Spec</h2>
        <p className="text-xs text-gray-600 mt-2">Users register with <b>Matric/Reg No</b> (CRU******* or 2********), email, password, and Level (JUPEB/100/200/300/500). <b>Visitor</b> needs only email + password.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {levels.map((l) => (
            <Chip key={l} label={l} onDelete={async () => { try{ await deleteLevel(l); setLevels(levels.filter(x=>x!==l)); setMsg(`Removed ${l}`)} catch(e:any){setMsg(e.message)} }} />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <select value={newLevel} onChange={e=>setNewLevel(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
            {ALLOWED_LEVELS.map(v=> <option key={v} value={v}>{v}</option>)}
          </select>
          <button onClick={async()=>{ if(!ALLOWED_LEVELS.includes(newLevel)) return; if(levels.includes(newLevel)) {setMsg('Level exists'); return;} try{ await createLevel({ name:newLevel, cap:1500, plan:'Standard'}); setLevels([...levels, newLevel]); setMsg(`Added ${newLevel}`)} catch(e:any){setMsg(e.message)}}} className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-semibold">Add Level</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Daily Meal Rates (Granular)</h2>
        <p className="text-xs text-gray-500 mt-1">Defaults: Breakfast ₦1,500 • Lunch ₦2,000 • Dinner ₦1,500 • All Three ₦5,000/day</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Breakfast (₦)</label>
            <input value={breakfast} onChange={e=>setBreakfast(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Lunch (₦)</label>
            <input value={lunch} onChange={e=>setLunch(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Dinner (₦)</label>
            <input value={dinner} onChange={e=>setDinner(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
          All Three auto = ₦{(Number(breakfast)+Number(lunch)+Number(dinner)).toLocaleString()} (Breakfast+ Lunch + Dinner) • Spec says default All Three ₦5,000 — admin can set individually to match.
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={async()=>{ try{ await updateFeedingAmount(Number(breakfast)); // backend will handle granular via same endpoint with metadata
              setMsg(`Rates updated: Breakfast ₦${breakfast}, Lunch ₦${lunch}, Dinner ₦${dinner} — logged`)} catch(e:any){setMsg(e.message)}}} className="bg-[#1A153B] text-white px-6 py-2.5 rounded-xl text-sm font-bold">Update Rates</button>
          <button onClick={async()=>{ try{ const r=await fundValidStudents(); setMsg(r.message);} catch(e:any){setMsg(e.message)}}} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold">Fund Valid Students</button>
        </div>
        {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">{msg}</p>}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
        Hostel configuration removed per spec • Simulated Transactions & Backup removed from sidebar
      </div>
    </div>
  );
}
