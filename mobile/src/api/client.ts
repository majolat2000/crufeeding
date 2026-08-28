import axios from 'axios';

/**
 * API client for Crawford backend.
 * All wallet/ledger calls go through /api/v1 with JWT bearer.
 */
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  // Inject JWT from secure store (expo-secure-store) in real app
  // const token = await SecureStore.getItemAsync('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Centralized error mapping for UI
    const msg = err.response?.data?.message ?? err.message;
    return Promise.reject(new Error(msg));
  }
);
