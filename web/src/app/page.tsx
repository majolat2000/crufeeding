import { StatsCard } from '@/components/StatsCard';

/**
 * Dashboard analytics — daily collections, levy, active wallets.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A153B]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time feeding transactions • 10% platform levy tracked</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Today Collections" value="₦482,500" hint="1,240 meals • +8% vs yesterday" accent="↑ 8.2%" />
        <StatsCard title="Platform Levy (10%)" value="₦48,250" hint="Auto-split to third-party" />
        <StatsCard title="Vendor Payout (90%)" value="₦434,250" hint="Cafeteria disbursements" />
        <StatsCard title="Active Wallets" value="1,842" hint="Avg balance ₦6,420" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1A153B]">Revenue — Last 7 Days</h2>
          <p className="text-xs text-gray-500 mt-1">Gross vs levy vs net vendor payout</p>
          {/* Placeholder chart — replace with Recharts BarChart */}
          <div className="mt-6 h-48 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-dashed border-indigo-200 flex items-center justify-center text-sm text-gray-500">
            Recharts BarChart — gross / levy / payout
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#1A153B]" /> Gross</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-400" /> Levy 10%</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500" /> Vendor 90%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1A153B]">By Hostel</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { name: 'Faith Hall', amt: '₦142,000', pct: 34 },
              { name: 'Hope Hall', amt: '₦118,500', pct: 28 },
              { name: 'Unity Hall', amt: '₦92,000', pct: 22 },
              { name: 'Grace Hall', amt: '₦68,000', pct: 16 },
            ].map((h) => (
              <div key={h.name} className="flex items-center justify-between">
                <span className="text-gray-700">{h.name}</span>
                <span className="font-semibold text-[#1A153B]">{h.amt}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            Today levy held: <b>₦48,250</b> → auto-settle at 18:00
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1A153B]">Recent Transactions</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-widest">
              <tr><th className="text-left py-2">Student</th><th className="text-left">Vendor</th><th className="text-right">Amount</th><th className="text-right">Levy</th><th className="text-right">Status</th></tr>
            </thead>
            <tbody>
              {[
                ['CRA/2023/001', 'Main Cafe', '₦1,200', '₦120', 'Success'],
                ['CRA/2023/042', 'Faith Cafe', '₦950', '₦95', 'Success'],
                ['CRA/2022/118', 'Main Cafe', '₦1,500', '₦150', 'Success'],
              ].map(([id, vendor, amt, levy, s]) => (
                <tr key={id} className="border-t border-gray-100"><td className="py-3">{id}</td><td>{vendor}</td><td className="text-right font-semibold">{amt}</td><td className="text-right text-amber-600">{levy}</td><td className="text-right"><span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">{s}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
