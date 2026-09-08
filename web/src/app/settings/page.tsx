'use client';
import { useState, useEffect } from 'react';
import { getConfig, updateMealRates, changePassword } from '@/lib/api';

export default function SettingsPage() {
  const [breakfast, setBreakfast] = useState(1500);
  const [lunch, setLunch] = useState(2000);
  const [dinner, setDinner] = useState(1500);
  const [msg, setMsg] = useState('');

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    getConfig().then((r) => {
      const d = r.data ?? r;
      setBreakfast(Number(d.breakfastRate ?? 1500));
      setLunch(Number(d.lunchRate ?? 2000));
      setDinner(Number(d.dinnerRate ?? 1500));
    }).catch(() => {});
  }, []);

  const handleUpdateRates = async () => {
    try {
      await updateMealRates({
        breakfastRate: breakfast,
        lunchRate: lunch,
        dinnerRate: dinner,
        allThreeRate: breakfast + lunch + dinner,
      });
      setMsg(`Rates updated: Breakfast ₦${breakfast.toLocaleString()}, Lunch ₦${lunch.toLocaleString()}, Dinner ₦${dinner.toLocaleString()}`);
    } catch (e: any) { setMsg(e.message); }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) { setPwMsg('Fill in all fields'); return; }
    if (newPw !== confirmPw) { setPwMsg('New passwords do not match'); return; }
    if (newPw.length < 6) { setPwMsg('Password must be at least 6 characters'); return; }
    try {
      await changePassword(currentPw, newPw);
      setPwMsg('Password changed successfully');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (e: any) { setPwMsg(e.message); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A153B]">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Meal rates, password management</p>
      </div>

      {/* Meal Rates */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Daily Meal Rates</h2>
        <p className="text-xs text-gray-500 mt-1">Adjustable numeric selectors</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Breakfast (₦)</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => setBreakfast(Math.max(0, breakfast - 100))} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">−</button>
              <input type="number" value={breakfast} onChange={e => setBreakfast(Number(e.target.value) || 0)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center" />
              <button onClick={() => setBreakfast(breakfast + 100)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Lunch (₦)</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => setLunch(Math.max(0, lunch - 100))} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">−</button>
              <input type="number" value={lunch} onChange={e => setLunch(Number(e.target.value) || 0)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center" />
              <button onClick={() => setLunch(lunch + 100)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Dinner (₦)</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => setDinner(Math.max(0, dinner - 100))} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">−</button>
              <input type="number" value={dinner} onChange={e => setDinner(Number(e.target.value) || 0)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center" />
              <button onClick={() => setDinner(dinner + 100)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">+</button>
            </div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
          All Three auto = ₦{(breakfast + lunch + dinner).toLocaleString()} per day
        </div>
        <button onClick={handleUpdateRates} className="mt-4 bg-[#1A153B] text-white px-6 py-2.5 rounded-xl text-sm font-bold">Update Rates</button>
        {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">{msg}</p>}
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Current Password</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">New Password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          </div>
        </div>
        <button onClick={handleChangePassword} className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold">Update Password</button>
        {pwMsg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">{pwMsg}</p>}
      </div>
    </div>
  );
}
