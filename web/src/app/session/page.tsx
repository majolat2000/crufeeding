'use client';
import { useState, useEffect } from 'react';
import { getSessionInfo, updateSession } from '@/lib/api';

export default function SessionPage() {
  const [session, setSession] = useState('2025/2026');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getSessionInfo()
      .then(r => { setSession(r.data.session); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const startYear = parseInt(session.split('/')[0]) || 2025;

  function increment() {
    setSession(`${startYear + 1}/${startYear + 2}`);
  }

  function decrement() {
    if (startYear > 2020) setSession(`${startYear - 1}/${startYear}`);
  }

  async function handleUpdate() {
    try {
      await updateSession(session);
      setMsg(`Session updated to ${session}`);
    } catch (e: any) { setMsg(e.message); }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading session...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Session</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Academic Session</h2>
        <p className="text-xs text-gray-500 mt-1">Manually adjustable by Super Admin / Bursar</p>

        <div className="mt-6 flex items-center gap-4">
          <button onClick={decrement} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-[#1A153B]">−</button>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-[#1A153B]">{session}</p>
            <p className="text-xs text-gray-500 mt-1">Current academic session</p>
          </div>
          <button onClick={increment} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-[#1A153B]">+</button>
        </div>

        <button onClick={handleUpdate} className="mt-6 bg-[#1A153B] text-white px-6 py-2.5 rounded-xl text-sm font-bold">
          Update Session
        </button>

        {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">{msg}</p>}
      </div>
    </div>
  );
}
