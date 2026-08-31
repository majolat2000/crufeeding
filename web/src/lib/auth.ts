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
  const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.message || 'Login failed');
  // expected { token, user: { email, role } }
  const token = j.data?.token ?? j.token;
  const role = j.data?.user?.role ?? j.user?.role;
  if (!token) throw new Error('No token returned');
  if (role !== 'super_admin' && role !== 'bursar') throw new Error('Web portal restricted to Super Admin / Bursar');
  setSession({ token, email, role });
  localStorage.setItem('token', token);
  return { token, role };
}
