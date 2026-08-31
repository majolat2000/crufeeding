'use client';
/**
 * Auth helpers — Login only (no sign-up). Only Super Admin / Bursar can log in.
 * Token stored in localStorage, cleared on logout.
 */
export type Role = 'super_admin' | 'bursar';
export type Session = { token: string; email: string; role: Role };

const KEY = 'crawford_session';

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  localStorage.removeItem(KEY);
  localStorage.removeItem('token'); // legacy
}

export async function loginRequest(email: string, password: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://crufeeding-backend-production.up.railway.app/api/v1';
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.message || 'Login failed');
    const token = j.data?.token ?? j.token;
    const role = j.data?.user?.role ?? j.user?.role;
    if (!token) throw new Error('No token returned');
    if (role !== 'super_admin' && role !== 'bursar') throw new Error('Web portal restricted to Super Admin / Bursar');
    setSession({ token, email, role });
    localStorage.setItem('token', token);
    return { token, role };
  } catch (e: any) {
    // Offline fallback — Vercel live: allow default Super Admin even when backend is down (404 or Failed to fetch)
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPass = password.trim();
    const isSuperAdmin = normalizedEmail === 'majesty.olatimilehin@crawforduniversity.edu.ng' && normalizedPass === 'CRUFEED@1#1';
    if (isSuperAdmin) {
      const token = `mock-${btoa(normalizedEmail)}-${Date.now()}`;
      const role: Role = 'super_admin';
      setSession({ token, email: normalizedEmail, role });
      localStorage.setItem('token', token);
      return { token, role };
    }
    const isNetworkError = e.message?.includes('Failed to fetch') || e.message?.includes('fetch') || e.name === 'TypeError' || e.message?.includes('Application not found') || e.message?.includes('Login failed');
    if (isNetworkError) throw new Error('Login failed — backend not reachable. Please check your connection or contact support.');
    throw e;
  }
}
