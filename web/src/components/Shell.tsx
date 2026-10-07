'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useCallback, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { getSession, clearSession } from '@/lib/auth';
import { Menu, Search, Bell } from 'lucide-react';

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

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

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

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
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4 md:pl-6">
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
