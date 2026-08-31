/**
 * Levels — per spec: JUPEB, 100/200/300/500 LEVEL, Visitor
 * Editing via Settings (hostel removed)
 */
const LEVELS = [
  { id: 'JUPEB', name: 'JUPEB', plan: 'All meals', cap: '₦5,000/day', students: 120 },
  { id: '100', name: '100 LEVEL', plan: 'All meals', cap: '₦5,000/day', students: 420 },
  { id: '200', name: '200 LEVEL', plan: 'All meals', cap: '₦5,000/day', students: 380 },
  { id: '300', name: '300 LEVEL', plan: 'All meals', cap: '₦5,000/day', students: 340 },
  { id: '500', name: '500 LEVEL', plan: 'All meals', cap: '₦5,000/day', students: 180 },
  { id: 'Visitor', name: 'Visitor', plan: 'Pay-as-you-go', cap: '—', students: 45 },
];

export default function LevelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Levels</h1>
          <p className="text-sm text-gray-500 mt-1">Meal caps and bursary eligibility by level</p>
        </div>
        <button className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Add Level</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
            <tr><th className="text-left px-4 py-3">Level</th><th className="text-left px-4 py-3">Meal Plan</th><th className="text-left px-4 py-3">Daily Cap</th><th className="text-left px-4 py-3">Students</th><th className="text-right px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {LEVELS.map((l) => (
              <tr key={l.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold text-[#1A153B]">{l.name}</td>
                <td className="px-4 py-3">{l.plan}</td>
                <td className="px-4 py-3 font-semibold">{l.cap}</td>
                <td className="px-4 py-3">{l.students}</td>
                <td className="px-4 py-3 text-right"><button className="text-[#1A153B] font-semibold text-xs">Configure</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
