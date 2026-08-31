import { useState, useCallback, useEffect, useRef } from 'react';
import { api } from '../api/client';

type Wallet = { balance: number; studentId: string };

/**
 * Hook for wallet balance — polls backend so admin actions (Fund Valid Students,
 * feeding amount, hostels/levels) reflect instantly on mobile.
 */
export function useWallet(studentId: string, pollMs = 8000) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/wallet/${studentId}`);
      setWallet(data.data ?? data);
    } catch (e) {
      console.warn('[wallet] fetch', e);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  // Initial + polling + on-focus (expo-router focus via interval is simplest)
  useEffect(() => {
    fetchBalance();
    timer.current = setInterval(fetchBalance, pollMs);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [fetchBalance, pollMs]);

  return { wallet, loading, fetchBalance };
}
