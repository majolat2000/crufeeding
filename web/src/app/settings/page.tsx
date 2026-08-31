'use client';
import { useState, useEffect } from 'react';
import { getHostels, createHostel, deleteHostel, getLevels, createLevel, deleteLevel, getConfig, updateFeedingAmount, fundValidStudents } from '@/lib/api';

/**
 * Settings — centralized: all actions hit PostgreSQL backend, logged to Activity Logs,
 * and instantly reflected in mobile via polling (useWallet).
 */
export default function SettingsPage() {
  const [hostels, setHostels] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [feedingAmount, setFeedingAmount] = useState('75000');
  const [newHostel, setNewHostel] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getHostels().then((r) => setHostels((r.data ?? r).map((h: any) => h.name ?? h))).catch(() => setHostels(['Faith Hall','Hope Hall','Unity Hall','Grace Hall']));
    getLevels().then((r) => setLevels((r.data ?? r).map((l: any) => l.name ?? l))).catch(() => setLevels(['100 Level','200 Level','300 Level','400 Level','500 Level']));
    getConfig().then((r) => setFeedingAmount(String(r.data?.feedingAmount ?? r.feedingAmount ?? 75000))).catch(()=>{});
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
        <p className="text-sm text-gray-500 mt-1">Hostels, Levels, feeding amount & fund trigger</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Hostels</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {hostels.map((h) => (
            <Chip key={h} label={h} onDelete={async () => { try{ await deleteHostel(h); setHostels(hostels.filter(x=>x!==h)); setMsg('Hostel deleted'); } catch(e:any){setMsg(e.message)} }} />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input value={newHostel} onChange={(e) => setNewHostel(e.target.value)} placeholder="New hostel name" className="flex-1 max-w-xs border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          <button onClick={async () => { if (!newHostel.trim()) return; try { await createHostel({ name: newHostel.trim(), capacity: 300 }); setHostels([...hostels, newHostel.trim()]); setNewHostel(''); setMsg('Hostel created — logged to Activity Logs'); } catch (e:any){ setMsg(e.message)} }} className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-semibold">New Hostel</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Academic Levels</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {levels.map((l) => (
            <Chip key={l} label={l} onDelete={async () => { try{ await deleteLevel(l); setLevels(levels.filter(x=>x!==l)); setMsg('Level deleted'); } catch(e:any){setMsg(e.message)} }} />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input value={newLevel} onChange={(e) => setNewLevel(e.target.value)} placeholder="e.g. 600 Level" className="flex-1 max-w-xs border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          <button onClick={async () => { if(!newLevel.trim()) return; try{ await createLevel({ name:newLevel.trim(), cap:1500, plan:'Standard'}); setLevels([...levels, newLevel.trim()]); setNewLevel(''); setMsg('Level created'); } catch(e:any){setMsg(e.message)}}} className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-semibold">New Level</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Feeding Amount (Global)</h2>
        <p className="text-xs text-gray-500 mt-1">Single source of truth (PostgreSQL) • bursar + super_admin only • mobile polls wallet</p>
        <div className="flex gap-3 mt-4 items-end">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Amount (₦)</label>
            <input value={feedingAmount} onChange={(e) => setFeedingAmount(e.target.value)} className="mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm w-48" />
          </div>
          <button onClick={async()=>{ try{ await updateFeedingAmount(Number(feedingAmount)); setMsg(`Feeding amount updated to ₦${Number(feedingAmount).toLocaleString()} — activity logged`);}catch(e:any){setMsg(e.message)}}} className="bg-[#1A153B] text-white px-6 py-2.5 rounded-xl text-sm font-bold">Update Amount</button>
          <button onClick={async()=>{ try{ const r=await fundValidStudents(); setMsg(r.message);}catch(e:any){setMsg(e.message)}}} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold">Fund Valid Students</button>
        </div>
        <p className="text-xs text-emerald-600 mt-3">100% direct funding — no levy. Mobile wallet refreshes via polling.</p>
        {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">{msg}</p>}
      </div>
    </div>
  );
}
