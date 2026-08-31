'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginRequest } from '@/lib/auth';

/**
 * Login only — no sign-up. Only Super Admins and Bursars.
 * Default Super Admin: majesty.olatimilehin@crawforduniversity.edu.ng / CRUFEED@1#1
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      await loginRequest(email.trim(), password);
      router.replace('/');
    } catch (e: any) {
      setErr(e.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#1A153B] text-white flex items-center justify-center font-extrabold mx-auto">CU</div>
          <h1 className="text-xl font-extrabold text-[#1A153B] mt-3">Crawford Feeding — Bursary Portal</h1>
          <p className="text-xs text-gray-500 mt-1">Login only • Super Admin / Bursar</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="majesty.olatimilehin@crawforduniversity.edu.ng" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required />
          </div>
          {err && <p className="text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl p-2">{err}</p>}
          <button disabled={loading} className="w-full bg-[#1A153B] text-white rounded-xl py-3 font-bold text-sm disabled:opacity-60">
            {loading ? 'Signing in…' : 'Log In'}
          </button>
          <p className="text-xs text-gray-400 text-center">No sign-up on web • Students register via mobile app</p>
        </form>
        <p className="text-[11px] text-gray-400 text-center mt-4">Default Super Admin seeded: majesty.olatimilehin@crawforduniversity.edu.ng / CRUFEED@1#1</p>
      </div>
    </div>
  );
}
