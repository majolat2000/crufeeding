import { StatsCard } from '@/components/StatsCard';
import { getCurrentSession } from '@/lib/session';

/**
 * Dashboard — Updated metrics per spec:
 * Total Users, Subscribers, New Users (week), Total disbursement (session), Total transactions (month)
 * Removed: Total amount spent, By Hostel, Restaurant Sales Breakdown (single restaurant now)
 */
export default function DashboardPage() {
  const session = getCurrentSession();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Session {session} • Single restaurant: The Cafeteria • 100% direct payout</p>
        </div>
        <span className="bg-[#1A153B] text-white text-xs font-bold px-3 py-1.5 rounded-full">{session}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Users" value="2,143" hint="all registered" accent="↑ 3.1%" />
        <StatsCard title="Subscribers" value="1,210" hint="active meal plans" accent="↑ 5.4%" />
        <StatsCard title="New Users (week)" value="47" hint="last 7 days" />
        <StatsCard title="Total Disbursement (session)" value="₦18,250,000" hint={`${session} so far`} />
        <StatsCard title="Total Transactions (month)" value="3,842" hint="users + subscribers" />
        <StatsCard title="The Cafeteria — Purchases" value="3,842" hint="single cafeteria • 100% payout" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1A153B]">Session Disbursement Trend</h2>
          <p className="text-xs text-gray-500 mt-1">Cumulative funding for {session}</p>
          <div className="mt-6 h-40 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-dashed border-indigo-200 flex items-center justify-center text-sm text-gray-500">
            Recharts Area — disbursement over time
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1A153B]">Subscribers by Plan</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ['Breakfast only', '420'],
              ['Lunch only', '310'],
              ['Dinner only', '180'],
              ['All Three', '300'],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between"><span className="text-gray-600">{k}</span><span className="font-bold text-[#1A153B]">{v}</span></div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">Breakfast ₦1,500 • Lunch ₦2,000 • Dinner ₦1,500 • All Three ₦5,000/day</p>
        </div>
      </div>
    </div>
  );
}
