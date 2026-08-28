'use client';
import { useState } from 'react';

/**
 * Settings / Configuration — Hostel & Level chips/tags + Feeding Amount + Fund trigger.
 * Interactive: delete chip, add new, update global amount.
 */
export default function SettingsPage() {
  const [hostels, setHostels] = useState(['Faith Hall', 'Hope Hall', 'Unity Hall', 'Grace Hall']);
  const [levels, setLevels] = useState(['100 Level', '200 Level', '300 Level', '400 Level', '500 Level']);
  const [feedingAmount, setFeedingAmount] = useState('75000');
  const [newHostel, setNewHostel] = useState('');
  const [newLevel, setNewLevel] = useState('');

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
            <Chip key={h} label={h} onDelete={() => setHostels(hostels.filter((x) => x !== h))} />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input value={newHostel} onChange={(e) => setNewHostel(e.target.value)} placeholder="New hostel name" className="flex-1 max-w-xs border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          <button onClick={() => { if (newHostel.trim()) { setHostels([...hostels, newHostel.trim()]); setNewHostel(''); } }} className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-semibold">New Hostel</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Academic Levels</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {levels.map((l) => (
            <Chip key={l} label={l} onDelete={() => setLevels(levels.filter((x) => x !== l))} />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input value={newLevel} onChange={(e) => setNewLevel(e.target.value)} placeholder="e.g. 600 Level" className="flex-1 max-w-xs border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          <button onClick={() => { if (newLevel.trim()) { setLevels([...levels, newLevel.trim()]); setNewLevel(''); } }} className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-semibold">New Level</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Feeding Amount (Global)</h2>
        <p className="text-xs text-gray-500 mt-1">Applied to next funding cycle • bursar + super_admin only</p>
        <div className="flex gap-3 mt-4 items-end">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Amount (₦)</label>
            <input value={feedingAmount} onChange={(e) => setFeedingAmount(e.target.value)} className="mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm w-48" />
          </div>
          <button className="bg-[#1A153B] text-white px-6 py-2.5 rounded-xl text-sm font-bold">Update Amount</button>
          <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold">Fund Valid Students</button>
        </div>
        <p className="text-xs text-amber-600 mt-3">Will credit ₦{Number(feedingAmount).toLocaleString()} to all verified wallets • levy not applied on funding.</p>
      </div>
    </div>
  );
}
