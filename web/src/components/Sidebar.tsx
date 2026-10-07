'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { clearSession, getSession } from '@/lib/auth';
import {
  LayoutDashboard, Users, UtensilsCrossed, ArrowLeftRight, Wallet, Shield, Minus, CalendarDays, FileText, History, Settings, LogOut, X, ChevronLeft, ChevronRight
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'MAIN',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/users', label: 'Users', icon: Users },
      { href: '/restaurants', label: 'Cafeteria', icon: UtensilsCrossed },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
      { href: '/fund-wallets', label: 'Fund Wallets', icon: Wallet },
      { href: '/admin', label: 'Admin', icon: Shield },
      { href: '/admin#deductions', label: 'Deductions', icon: Minus },
      { href: '/session', label: 'Session', icon: CalendarDays },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { href: '/activity-logs', label: 'Activity Logs', icon: FileText },
      { href: '/history', label: 'History', icon: History },
      { href: '/settings', label: 'Settings', icon: Settings },
    ]
  }
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [session, setSession] = useState<{email?: string, role?: string} | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  function logout() {
    clearSession();
    router.replace('/login');
  }

  const sidebarClasses = `
    shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen fixed lg:sticky top-0 z-40 transition-all duration-300
    ${collapsed ? 'lg:w-20' : 'lg:w-64'}
    ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && setIsOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between gap-3 h-16 shrink-0">
          <div className={`flex items-center gap-3 min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <div className="relative w-8 h-8 shrink-0 rounded-md overflow-hidden">
              <Image src="/crawford-crest.png" alt="Crawford University" fill sizes="32px" className="object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-[15px] leading-tight text-gray-900">Crawford</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Mobile close button */}
            <button onClick={() => setIsOpen && setIsOpen(false)} className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
            {/* Desktop collapse button */}
            <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-xs font-semibold text-gray-400 tracking-wider mb-2">
                  {group.title}
                </p>
              )}
              {collapsed && (
                <div className="hidden lg:block w-full border-t border-gray-100 my-2" />
              )}
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen && setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    } ${collapsed ? 'lg:justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
                    <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="pt-4 border-t border-gray-100 space-y-1">
            <button 
              onClick={logout} 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'lg:justify-center' : ''}`}
              title={collapsed ? 'Log Out' : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0" /> 
              <span className={collapsed ? 'lg:hidden' : ''}>Log Out</span>
            </button>
          </div>
        </nav>

        <div className={`p-4 border-t border-gray-100 ${collapsed ? 'lg:hidden' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              {session?.email?.charAt(0).toUpperCase() || 'B'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{session?.email ?? 'Bursar'}</p>
              <p className="text-xs text-gray-500 capitalize">{session?.role ? session.role.replace('_', ' ') : 'Administrator'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
