'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { getSession } from '@/lib/auth';

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/login';

  useEffect(() => {
    if (!isLogin) {
      const s = getSession();
      if (!s) router.replace('/login');
      else if (s.role !== 'super_admin' && s.role !== 'bursar') router.replace('/login');
    }
  }, [pathname, isLogin, router]);

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
