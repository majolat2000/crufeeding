'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useCallback, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { getSession, clearSession } from '@/lib/auth';
import { Menu } from 'lucide-react';

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

function getPageTitle(pathname: string) {
  if (pathname === '/') return 'Dashboard';
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0) {
    const name = parts[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
  }
  return 'Dashboard';
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/login';
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<{email?: string, role?: string} | null>(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  const doLogout = useCallback(() => {
    clearSession();
    localStorage.removeItem('lastActivity');
    router.replace('/login');
  }, [router]);

  // Auth guard + inactivity timer
  useEffect(() => {
    if (isLogin) {
      setIsCheckingAuth(false);
      return;
    }

    const s = getSession();
    if (!s || (s.role !== 'super_admin' && s.role !== 'bursar')) {
      doLogout();
      return;
    }

    // Initialize lastActivity if not set
    if (!localStorage.getItem('lastActivity')) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }

    setIsCheckingAuth(false);

    const checkIdle = () => {
      const last = Number(localStorage.getItem('lastActivity') || '0');
      if (last > 0 && Date.now() - last > TIMEOUT_MS) {
        doLogout();
      }
    };

    const resetIdle = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Use interval to check explicitly, bypassing background tab setTimeout throttling
    const interval = setInterval(checkIdle, 10000); 

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const;
    events.forEach(e => document.addEventListener(e, resetIdle, { passive: true }));
    
    // Check immediately on visibility change (when user returns to tab)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkIdle();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(interval);
      events.forEach(e => document.removeEventListener(e, resetIdle));
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isLogin, pathname, router, doLogout]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm font-medium animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] text-gray-900 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
              {getPageTitle(pathname)}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 border-gray-200 pl-4 md:pl-6">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {session?.email?.charAt(0).toUpperCase() || 'B'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block truncate max-w-[120px]">
                {session?.email?.split('@')[0] || 'User'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-[1280px] mx-auto page-transition">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 sm:hidden">
              {getPageTitle(pathname)}
            </h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
