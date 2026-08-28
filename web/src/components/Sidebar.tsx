'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Dark sidebar layout — navy #1A153B, white text, collapsible on mobile.
 * Used in src/app/layout.tsx
 */
const NAV = [
  { href: '/', label: 'Dashboard', icon: '◧' },
  { href: '/hostels', label: 'Hostels', icon: '⌂' },
  { href: '/levels', label: 'Levels', icon: '▤' },
  { href: '/admins', label: 'Admins', icon: '☺' },
  { href: '/logs', label: 'Activity Logs', icon: '≡' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 bg-[#1A153B] text-white flex flex-col min-h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="font-extrabold text-lg leading-none">Crawford</h1>
        <p className="text-xs text-indigo-200 mt-1">Feeding Management</p>
        <p className="text-[11px] text-indigo-300 mt-1">Admin Portal</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                active ? 'bg-white text-[#1A153B] font-semibold' : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              <span className="text-base">{item.icon}</span> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-indigo-200">Signed in as</p>
          <p className="text-sm font-semibold">Super Admin</p>
          <p className="text-xs text-indigo-300">bursary@crawford.edu.ng</p>
        </div>
      </div>
    </aside>
  );
}
