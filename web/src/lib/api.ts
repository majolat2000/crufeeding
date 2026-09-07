/**
 * Centralized API client — PostgreSQL backend.
 * All web admin actions go through here.
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

// Auth
export const loginApi = (email: string, password: string) => req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const changePassword = (currentPassword: string, newPassword: string) => req('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });

// Dashboard
export const getDashboard = () => req('/admin/dashboard');

// Users
export const getUsers = () => req('/admin/users');
export const updateUser = (id: string, data: any) => req(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = (id: string) => req(`/admin/${id}`, { method: 'DELETE' });
export const updateRole = (id: string, role: string) => req(`/admin/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) });

// Config / Meal Rates
export const getConfig = () => req('/config');
export const updateMealRates = (data: { breakfastRate?: number; lunchRate?: number; dinnerRate?: number }) => req('/config/feeding-amount', { method: 'PUT', body: JSON.stringify(data) });
export const fundValidStudents = (days: number) => req('/config/fund-valid', { method: 'POST', body: JSON.stringify({ days }) });

// Levels
export const getLevels = () => req('/levels');
export const createLevel = (data: any) => req('/levels', { method: 'POST', body: JSON.stringify(data) });
export const deleteLevel = (id: string) => req(`/levels/${id}`, { method: 'DELETE' });

// Transactions
export const getTransactions = (params = '') => req(`/payments/transactions${params}`);

// Activity Logs
export const getActivityLogs = () => req('/activity-logs');

// Session
export const getSessionInfo = () => req('/config/session');

// Admins
export const getAdmins = () => req('/admin');
