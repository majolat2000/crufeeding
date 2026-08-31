'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { clearSession, getSession } from '@/lib/auth';

const NAV = [
  { href: '/', label: 'Dashboard', icon: '◧' },
  { href: '/users', label: 'Users', icon: '☺' },
  { href: '/restaurants', label: 'Restaurants', icon: '🍔' },
  { href: '/transactions', label: 'Transactions', icon: '≡' },
  { href: '/fund-wallets', label: 'Fund Wallets', icon: '💳' },
  { href: '/admin', label: 'Admin', icon: '🛡' },
  { href: '/session', label: 'Session', icon: '📅' },
  { href: '/activity-logs', label: 'Activity Logs', icon: '📝' },
  { href: '/history', label: 'History', icon: '🕒' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const session = typeof window !== 'undefined' ? getSession() : null;

  function logout() {
    clearSession();
    router.replace('/login');
  }

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} shrink-0 bg-[#1A153B] text-white flex flex-col min-h-screen sticky top-0 transition-all duration-200`}>
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="font-extrabold text-lg leading-none">Crawford</h1>
            <p className="text-xs text-indigo-200 mt-1">Feeding Management</p>
            <p className="text-[11px] text-indigo-300">Bursary Portal</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
          <span className="text-lg leading-none">☰</span>
        </button>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition ${active ? 'bg-white text-[#1A153B] font-bold' : 'text-indigo-100 hover:bg-white/10'} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-base w-5 text-center">{item.icon}</span> {!collapsed && item.label}
            </Link>
          );
        })}
        <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-200 hover:bg-white/10 mt-2 ${collapsed ? 'justify-center' : ''}`}>
          <span className="text-base w-5 text-center">↪</span> {!collapsed && 'Log Out'}
        </button>
      </nav>
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs text-indigo-200">Signed in as</p>
            <p className="text-sm font-bold truncate">{session?.email ?? 'Super Admin'}</p>
            <p className="text-xs text-indigo-300 capitalize">{session?.role?.replace('_', ' ') ?? 'super_admin'}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
