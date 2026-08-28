import { StatsCard } from '@/components/StatsCard';

/**
 * Dashboard Overview — 6 metric cards + restaurant Donut/Pie chart.
 * Metrics: Verified Students, Unverified Students, New Users, Total Disbursement, Total Amount Spent, Total Transactions
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A153B]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Feeding wallet overview • Restaurant distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Verified Students" value="1,842" hint=" bursary-verified" accent="↑ 4.2%" />
        <StatsCard title="Unverified Students" value="217" hint="pending docs" />
        <StatsCard title="New Users" value="84" hint="this week" accent="↑ 12%" />
        <StatsCard title="Total Disbursement" value="₦12,450,000" hint="semester allocation" />
        <StatsCard title="Total Amount Spent" value="₦6,820,000" hint="54.8% utilized" />
        <StatsCard title="Total Transactions" value="18,420" hint="avg ₦370 • levy 10%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1A153B]">Restaurant Sales Breakdown</h2>
          <p className="text-xs text-gray-500 mt-1">Donut / Pie distribution — Recharts</p>
          <div className="mt-6 flex flex-col md:flex-row gap-6 items-center">
            {/* Donut placeholder — replace with Recharts PieChart */}
            <div className="w-48 h-48 rounded-full border-[16px] border-[#1A153B] relative flex items-center justify-center" style={{ borderTopColor: '#4338CA', borderRightColor: '#F59E0B', borderBottomColor: '#10B981' }}>
              <div className="absolute w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-[#1A153B]">18,420 tx</span>
              </div>
            </div>
            <div className="flex-1 space-y-3 text-sm w-full">
              {[
                { name: 'Burger & Bread', pct: 34, color: '#1A153B' },
                { name: 'Tasty Vine Kitchen', pct: 28, color: '#4338CA' },
                { name: 'Cresta', pct: 18, color: '#F59E0B' },
                { name: 'Mama Cass', pct: 12, color: '#10B981' },
                { name: 'Others', pct: 8, color: '#9CA3AF' },
              ].map((r) => (
                <div key={r.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: r.color }} /> {r.name}</span>
                  <span className="font-bold text-[#1A153B]">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Chart: Recharts PieChart with Cell colors — gross, levy 10% split logged.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-[#1A153B] text-sm">By Hostel (today)</h3>
            <div className="mt-4 space-y-2 text-sm">
              {[
                ['Faith Hall', '₦142,000'],
                ['Hope Hall', '₦118,500'],
                ['Unity Hall', '₦92,000'],
              ].map(([h, amt]) => (
                <div key={h} className="flex justify-between"><span className="text-gray-600">{h}</span><span className="font-bold text-[#1A153B]">{amt}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
            Today levy held: <b>₦48,250</b> → auto-settle 18:00. Vendor 90% = ₦434,250.
          </div>
        </div>
      </div>
    </div>
  );
}
