import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../api/client';

type User = {
  id: string;
  email: string;
  fullname?: string;
  role: string;
  matricNo?: string;
  level?: string;
  hostel?: string;
  mealBreakfast?: boolean;
  mealLunch?: boolean;
  mealDinner?: boolean;
  biometricEnabled?: boolean;
  balance?: number;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginPin: (email: string, pin: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  verifyOtp: (email: string, code: string) => Promise<string>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setPin: (pin: string, currentPassword: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<void>;
  toggleBiometric: (enabled: boolean) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  hydrated: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { token, user } = data.data;
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      setAuthToken(token);
      set({ user, token, loading: false });
    } catch (e: any) {
      set({ loading: false });
      throw e;
    }
  },

  loginPin: async (email, pin) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login-pin', { email, pin });
      const { token, user } = data.data;
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      setAuthToken(token);
      set({ user, token, loading: false });
    } catch (e: any) {
      set({ loading: false });
      throw e;
    }
  },

  signup: async (signupData) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/signup', signupData);
      const { token, user } = data.data;
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      setAuthToken(token);
      set({ user, token, loading: false });
    } catch (e: any) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    setAuthToken(null);
    set({ user: null, token: null });
  },

  hydrate: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('auth_user');
      if (token && userStr) {
        setAuthToken(token);
        set({ token, user: JSON.parse(userStr), hydrated: true });
        get().refreshUser().catch(() => {});
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      const user = data.data;
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      set({ user });
    } catch {}
  },

  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data.data?.code || '';
  },

  verifyOtp: async (email, code) => {
    const { data } = await api.post('/auth/verify-otp', { email, code, purpose: 'password_reset' });
    return data.data.resetToken;
  },

  resetPassword: async (resetToken, newPassword) => {
    await api.post('/auth/reset-password', { resetToken, newPassword });
  },

  changePassword: async (currentPassword, newPassword) => {
    await api.post('/auth/change-password', { currentPassword, newPassword });
  },

  setPin: async (pin, currentPassword) => {
    await api.post('/auth/set-pin', { pin, currentPassword });
  },

  verifyPin: async (pin) => {
    await api.post('/auth/verify-pin', { pin });
  },

  toggleBiometric: async (enabled) => {
    await api.put('/auth/biometric', { enabled });
    const user = get().user;
    if (user) {
      const updated = { ...user, biometricEnabled: enabled };
      await AsyncStorage.setItem('auth_user', JSON.stringify(updated));
      set({ user: updated });
    }
  },
}));
