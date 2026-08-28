'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Fixed dark vertical sidebar #1A153B — 12 modules per spec + Log Out.
 * Light grey background #F4F5F7 for main content (in layout.tsx).
 */
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
  { href: '/simulated', label: 'Simulated Transactions', icon: '🧪' },
  { href: '/backup', label: 'Backup', icon: '💾' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 bg-[#1A153B] text-white flex flex-col min-h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="font-extrabold text-lg leading-none">Crawford</h1>
        <p className="text-xs text-indigo-200 mt-1">Feeding Management</p>
        <p className="text-[11px] text-indigo-300 mt-1">Bursary Portal</p>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition ${
                active ? 'bg-white text-[#1A153B] font-bold' : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span> {item.label}
            </Link>
          );
        })}
        <Link href="/logout" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-200 hover:bg-white/10 mt-2">
          <span className="text-base w-5 text-center">↪</span> Log Out
        </Link>
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-indigo-200">Signed in as</p>
          <p className="text-sm font-bold">Super Admin</p>
          <p className="text-xs text-indigo-300">bursary@crawford.edu.ng</p>
        </div>
      </div>
    </aside>
  );
}
