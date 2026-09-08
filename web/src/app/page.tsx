'use client';
import { useState, useEffect } from 'react';
import { getDashboard } from '@/lib/api';
import { useSession } from '@/lib/session-context';

type DashboardData = {
  totalUsers: number;
  totalSubscribers: number;
  newUsersWeek: number;
  totalDisbursement: number;
  monthlyTransactions: number;
  cafeteriaPurchases: number;
  subscriberBreakdown: {
    breakfastOnly: number;
    lunchOnly: number;
    dinnerOnly: number;
    breakfastLunch: number;
    breakfastDinner: number;
    lunchDinner: number;
    allThree: number;
  };
};

export default function DashboardPage() {
  const { session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message));
  }, []);

  const d = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Session {session} &bull; Single cafeteria: The Cafeteria &bull; 100% direct payout</p>
        </div>
        <span className="bg-[#1A153B] text-white text-xs font-bold px-3 py-1.5 rounded-full">{session}</span>
      </div>

      {error && <p className="text-xs bg-red-50 border border-red-200 rounded-xl p-2">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat title="Total Users" value={d?.totalUsers ?? '—'} hint="all registered" />
        <Stat title="Subscribers" value={d?.totalSubscribers ?? '—'} hint="active meal plans" />
        <Stat title="New Users (week)" value={d?.newUsersWeek ?? '—'} hint="last 7 days" />
        <Stat title="Total Disbursement (session)" value={d ? `₦${d.totalDisbursement.toLocaleString()}` : '—'} hint={`${session} so far`} />
        <Stat title="Total Transactions (month)" value={d?.monthlyTransactions ?? '—'} hint="users + subscribers" />
        <Stat title="The Cafeteria — Purchases" value={d?.cafeteriaPurchases ?? '—'} hint="single cafeteria • 100% payout" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1A153B]">Session Disbursement Trend</h2>
          <p className="text-xs text-gray-500 mt-1">Cumulative funding for {session}</p>
          <div className="mt-6 h-40 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-dashed border-amber-200 flex items-center justify-center text-sm text-gray-500">
            Chart placeholder — disbursement over time
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1A153B]">Subscribers by Plan</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ['Breakfast only', d?.subscriberBreakdown.breakfastOnly ?? 0],
              ['Lunch only', d?.subscriberBreakdown.lunchOnly ?? 0],
              ['Dinner only', d?.subscriberBreakdown.dinnerOnly ?? 0],
              ['Breakfast & Lunch', d?.subscriberBreakdown.breakfastLunch ?? 0],
              ['Breakfast & Dinner', d?.subscriberBreakdown.breakfastDinner ?? 0],
              ['Lunch & Dinner', d?.subscriberBreakdown.lunchDinner ?? 0],
              ['All Three', d?.subscriberBreakdown.allThree ?? 0],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-600">{k}</span>
                <span className="font-bold text-[#1A153B]">{String(v)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">Breakfast ₦1,500 • Lunch ₦2,000 • Dinner ₦1,500 • All Three ₦5,000/day</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, hint }: { title: string; value: string | number; hint: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-extrabold text-[#1A153B] mt-2">{String(value)}</p>
      <p className="text-xs text-gray-400 mt-1">{hint}</p>
    </div>
  );
}
