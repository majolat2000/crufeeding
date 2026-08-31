/**
 * Centralized API client — single source of truth (PostgreSQL backend).
 * All web admin actions go through here and are immediately reflected in mobile via same DB.
 */
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

async function req(path: string, opts: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || `API ${res.status}`);
  return res.json();
}

// Config / Fund
export const getConfig = () => req('/config');
export const updateFeedingAmount = (amount: number) => req('/config/feeding-amount', { method: 'PUT', body: JSON.stringify({ amount }) });
export const fundValidStudents = () => req('/config/fund-valid', { method: 'POST' });

// Hostels / Levels
export const getHostels = () => req('/hostels');
export const createHostel = (data: any) => req('/hostels', { method: 'POST', body: JSON.stringify(data) });
export const deleteHostel = (id: string) => req(`/hostels/${id}`, { method: 'DELETE' });
export const getLevels = () => req('/levels');
export const createLevel = (data: any) => req('/levels', { method: 'POST', body: JSON.stringify(data) });
export const deleteLevel = (id: string) => req(`/levels/${id}`, { method: 'DELETE' });

// Activity Logs — chronological audit
export const getActivityLogs = () => req('/activity-logs');

// Wallet / Ledger (shared with mobile)
export const getWallet = (studentId: string) => req(`/wallet/${studentId}`);
export const getLedger = (params = '') => req(`/payments/ledger${params}`);
