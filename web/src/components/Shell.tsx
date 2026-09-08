'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { getSession, clearSession } from '@/lib/auth';

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/login';
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const doLogout = useCallback(() => {
    clearSession();
    router.replace('/login');
  }, [router]);

  // Inactivity timer — reset on any user interaction
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doLogout, TIMEOUT_MS);
  }, [doLogout]);

  // Auth guard + inactivity timer
  useEffect(() => {
    if (isLogin) return;

    const s = getSession();
    if (!s || (s.role !== 'super_admin' && s.role !== 'bursar')) {
      router.replace('/login');
      return;
    }

    resetTimer();

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const;
    const handler = () => resetTimer();
    events.forEach(e => document.addEventListener(e, handler, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(e => document.removeEventListener(e, handler));
    };
  }, [isLogin, pathname, router, resetTimer]);

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-[1280px] mx-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
