'use client';
import { useState, useEffect } from 'react';
import { updateSession } from '@/lib/api';
import { useSession } from '@/lib/session-context';

export default function SessionPage() {
  const { session: currentSession, refresh } = useSession();
  const [session, setSession] = useState(currentSession);
  const [msg, setMsg] = useState('');

  useEffect(() => { setSession(currentSession); }, [currentSession]);

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
      await refresh();
      setMsg(`Session updated to ${session}`);
    } catch (e: any) { setMsg(e.message); }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Session</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Academic Session</h2>
        <p className="text-xs text-gray-500 mt-1">Manually adjustable by Bursar</p>

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
