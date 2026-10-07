'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginRequest } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

/**
 * Login only — no sign-up. Only Bursars.
 * Default: majesty.olatimilehin@crawforduniversity.edu.ng / CRUFEED@1#1
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A153B]/5 to-purple-500/10 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 relative">
            <Image src="/crawford-crest.png" alt="Crawford University" fill sizes="64px" className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A153B] mt-4">Crawford Feeding</h1>
          <p className="text-sm text-gray-500 mt-1">Bursary Management Portal</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Email</label>
            <input 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="Enter your email" 
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A153B]/20 focus:border-[#1A153B] transition-all" 
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="Enter your password" 
              className="mt-1.5 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A153B]/20 focus:border-[#1A153B] transition-all" 
              required 
            />
          </div>
          {err && <p className="text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">{err}</p>}
          <button 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-2 bg-[#1A153B] text-white rounded-xl py-3.5 font-bold text-sm hover:bg-[#1A153B]/90 focus:outline-none focus:ring-4 focus:ring-[#1A153B]/20 transition-all disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Signing in…' : 'Log In'}
          </button>
          <p className="text-xs text-gray-400 text-center pt-2">No sign-up on web • Students register via mobile app</p>
        </form>
      </div>
    </div>
  );
}
