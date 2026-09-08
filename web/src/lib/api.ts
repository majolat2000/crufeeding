/**
 * Centralized API client — PostgreSQL backend.
 * All web admin actions go through here.
 */

const API = process.env.NEXT_PUBLIC_API_URL || 'https://crufeeding-backend.onrender.com/api/v1';

function logoutAndRedirect() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('crawford_session');
  localStorage.removeItem('token');
  window.location.replace('/login');
}

async function req(path: string, opts: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
    cache: 'no-store',
  });

  if (res.status === 401) {
    logoutAndRedirect();
    throw new Error('Session expired — please log in again');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `API error ${res.status}`);
  }

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
export const updateMealRates = (data: { breakfastRate?: number; lunchRate?: number; dinnerRate?: number; allThreeRate?: number }) => req('/config/feeding-amount', { method: 'PUT', body: JSON.stringify(data) });
export const fundValidStudents = (days: number) => req('/config/fund-valid', { method: 'POST', body: JSON.stringify({ days }) });
export const fundSelective = (days: number, studentIds: string[]) => req('/config/fund-selective', { method: 'POST', body: JSON.stringify({ days, studentIds }) });

// Session
export const getSessionInfo = () => req('/config/session');
export const updateSession = (session: string) => req('/config/session', { method: 'PUT', body: JSON.stringify({ session }) });

// Levels
export const getLevels = () => req('/levels');
export const createLevel = (data: any) => req('/levels', { method: 'POST', body: JSON.stringify(data) });
export const deleteLevel = (id: string) => req(`/levels/${id}`, { method: 'DELETE' });

// Transactions
export const getTransactions = (params = '') => req(`/payments/transactions${params}`);
export const refundTransaction = (id: string) => req(`/payments/refund/${id}`, { method: 'POST' });

// Cafeteria (filtered transactions)
export const getCafeteriaTransactions = (params = '') => req(`/payments/transactions?vendorId=CAFETERIA${params}`);

// Activity Logs
export const getActivityLogs = () => req('/activity-logs');

// Admins
export const getAdmins = () => req('/admin');

// Deductions
export const deductFromWallet = (studentId: string, amount: number, reason: string) => req('/admin/deduct', { method: 'POST', body: JSON.stringify({ studentId, amount, reason }) });
