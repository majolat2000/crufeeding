import { useState, useCallback } from 'react';
import { api } from '../api/client';

type Wallet = { balance: number; studentId: string };

/**
 * Hook for wallet balance + top-up.
 */
export function useWallet(studentId: string) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/wallet/${studentId}`);
      setWallet(data.data);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  return { wallet, loading, fetchBalance };
}
