'use client';
import { useState, useEffect } from 'react';
import { getDashboard } from '@/lib/api';
import { useSession } from '@/lib/session-context';
import { StatsCard } from '@/components/StatsCard';
import { DollarSign, TrendingUp, ShoppingCart, Users } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((r) => {
        setData(r.data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const d = data;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">COMMAND CENTER</p>
          <h1 className="text-3xl font-extrabold text-[#1A153B]">Operating Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Monitor feeding operations, student subscriptions, and financial metrics from one focused workspace.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-[#1A153B]/10 text-[#1A153B] text-xs font-bold px-2.5 py-1 rounded-md">Session {session}</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">Single cafeteria</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-[#1A153B] bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
            Invoices
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-[#1A153B] rounded-xl shadow-sm hover:bg-[#1A153B]/90 transition-colors">
            Fund Students
          </button>
        </div>
      </div>

      {error && <p className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">{error}</p>}

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <LoadingSkeleton className="h-32 rounded-2xl" />
            <LoadingSkeleton className="h-32 rounded-2xl" />
            <LoadingSkeleton className="h-32 rounded-2xl" />
            <LoadingSkeleton className="h-32 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LoadingSkeleton className="h-80 rounded-2xl" />
            <LoadingSkeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Total Users" 
              value={d?.totalUsers ?? '—'} 
              hint="All registered students" 
              icon={Users}
              iconColor="blue"
              accent={{ value: '12% vs last month', positive: true }}
            />
            <StatsCard 
              title="Subscribers" 
              value={d?.totalSubscribers ?? '—'} 
              hint="Active meal plans"
              icon={TrendingUp}
              iconColor="green"
              accent={{ value: '8.5% vs last month', positive: true }}
            />
            <StatsCard 
              title="Session Funding" 
              value={d ? `₦${(d.totalDisbursement/1000000).toFixed(1)}M` : '—'} 
              hint="Total disbursement"
              icon={DollarSign}
              iconColor="amber"
              accent={{ value: 'Stable', positive: true }}
            />
            <StatsCard 
              title="Monthly Trans." 
              value={d?.monthlyTransactions ?? '—'} 
              hint="Users + subscribers"
              icon={ShoppingCart}
              iconColor="purple"
              accent={{ value: '2.1% vs last month', positive: false }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-[#1A153B]">Session Disbursement Trend</h2>
                  <p className="text-xs text-gray-500 mt-1">Cumulative funding for {session}</p>
                </div>
                <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100">
                  {['12M', '6M', '3M', '30D'].map(period => (
                    <button key={period} className={`px-2.5 py-1 text-xs font-medium rounded-md ${period === '12M' ? 'bg-white shadow-sm text-[#1A153B]' : 'text-gray-500 hover:text-gray-700'}`}>
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 rounded-xl bg-gradient-to-br from-amber-50/50 to-white border border-dashed border-amber-200 flex items-center justify-center text-sm text-gray-500">
                Chart placeholder — disbursement over time
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-[#1A153B]">Subscribers by Plan</h2>
                  <p className="text-xs text-gray-500 mt-1">Active meal plan distribution</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                {[
                  ['Breakfast only', d?.subscriberBreakdown.breakfastOnly ?? 0],
                  ['Lunch only', d?.subscriberBreakdown.lunchOnly ?? 0],
                  ['Dinner only', d?.subscriberBreakdown.dinnerOnly ?? 0],
                  ['Breakfast & Lunch', d?.subscriberBreakdown.breakfastLunch ?? 0],
                  ['Breakfast & Dinner', d?.subscriberBreakdown.breakfastDinner ?? 0],
                  ['Lunch & Dinner', d?.subscriberBreakdown.lunchDinner ?? 0],
                  ['All Three', d?.subscriberBreakdown.allThree ?? 0],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex items-center">
                    <span className="text-gray-600 w-1/3">{String(k)}</span>
                    <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1A153B] rounded-full" 
                        style={{ width: `${Math.max(5, (Number(v) / Math.max(1, d?.totalSubscribers || 1)) * 100)}%` }} 
                      />
                    </div>
                    <span className="font-bold text-[#1A153B] w-12 text-right">{String(v)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="bg-gray-50 px-2 py-1 rounded">Breakfast ₦1,500</span>
                <span className="bg-gray-50 px-2 py-1 rounded">Lunch ₦2,000</span>
                <span className="bg-gray-50 px-2 py-1 rounded">Dinner ₦1,500</span>
                <span className="bg-[#1A153B]/5 text-[#1A153B] px-2 py-1 rounded font-medium">All Three ₦5,000/day</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

