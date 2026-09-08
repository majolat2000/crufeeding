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

  const logout = useCallback(() => {
    clearSession();
    router.replace('/login');
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    if (isLogin) return;

    const s = getSession();
    if (!s) { router.replace('/login'); return; }
    if (s.role !== 'super_admin' && s.role !== 'bursar') { router.replace('/login'); return; }

    // Start inactivity timer
    resetTimer();

    // Track activity events
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const handler = () => resetTimer();
    events.forEach(e => document.addEventListener(e, handler, { passive: true }));

    // Handle tab close
    const beforeUnload = () => {
      // Clear session on tab close (browser unload)
      clearSession();
    };
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(e => document.removeEventListener(e, handler));
      window.removeEventListener('beforeunload', beforeUnload);
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
