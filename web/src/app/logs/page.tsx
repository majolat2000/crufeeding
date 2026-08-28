/**
 * Activity logs — immutable audit trail of wallet, levy, admin actions.
 */
const LOGS = [
  { id: '1', actor: 'bursary@crawford.edu.ng', action: 'Approved top-up ₦10,000', target: 'CRA/2023/001', time: '2026-08-28 12:34', ip: '102.89.12.4' },
  { id: '2', actor: 'system', action: 'Levy split 10% → ₦120 remitted', target: 'TX-88421 vendor Main Cafe', time: '2026-08-28 12:34', ip: '-' },
  { id: '3', actor: 'k.ojo@crawford.edu.ng', action: 'Updated Hostel Faith Hall capacity 400→420', target: 'hostels/faith-hall', time: '2026-08-27 16:02', ip: '102.89.12.4' },
  { id: '4', actor: 'bursary@crawford.edu.ng', action: 'Invited bursar t.adeyemi@crawford.edu.ng', target: 'admins', time: '2026-08-27 09:12', ip: '102.89.12.4' },
];

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A153B]">Activity Logs</h1>
        <p className="text-sm text-gray-500 mt-1">Immutable audit trail — every wallet & admin action</p>
      </div>

      <div className="flex gap-2">
        <input placeholder="Search actor, action, target..." className="flex-1 max-w-md border border-gray-200 rounded-xl px-3 py-2 text-sm" />
        <button className="border border-gray-200 bg-white px-4 py-2 rounded-xl text-sm font-semibold">Export CSV</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
            <tr><th className="text-left px-4 py-3">Time</th><th className="text-left px-4 py-3">Actor</th><th className="text-left px-4 py-3">Action</th><th className="text-left px-4 py-3">Target</th><th className="text-left px-4 py-3">IP</th></tr>
          </thead>
          <tbody>
            {LOGS.map((l) => (
              <tr key={l.id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-500 text-xs">{l.time}</td>
                <td className="px-4 py-3 font-mono text-xs">{l.actor}</td>
                <td className="px-4 py-3">{l.action}</td>
                <td className="px-4 py-3 font-mono text-xs">{l.target}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
