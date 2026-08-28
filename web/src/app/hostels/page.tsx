/**
 * Hostels settings — CRUD for hostel entities that gate meal access.
 */
const HOSTELS = [
  { id: '1', name: 'Faith Hall', capacity: 400, occupants: 342, status: 'Active' },
  { id: '2', name: 'Hope Hall', capacity: 350, occupants: 310, status: 'Active' },
  { id: '3', name: 'Unity Hall', capacity: 300, occupants: 278, status: 'Active' },
  { id: '4', name: 'Grace Hall', capacity: 250, occupants: 198, status: 'Maintenance' },
];

export default function HostelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Hostels</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hostel capacity and meal windows</p>
        </div>
        <button className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-semibold">+ New Hostel</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
            <tr><th className="text-left px-4 py-3">Hostel</th><th className="text-left px-4 py-3">Capacity</th><th className="text-left px-4 py-3">Occupancy</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {HOSTELS.map((h) => (
              <tr key={h.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold text-[#1A153B]">{h.name}</td>
                <td className="px-4 py-3">{h.capacity}</td>
                <td className="px-4 py-3">{h.occupants} • <span className="text-gray-500">{Math.round((h.occupants/h.capacity)*100)}%</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${h.status==='Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{h.status}</span></td>
                <td className="px-4 py-3 text-right"><button className="text-[#1A153B] font-semibold text-xs">Edit</button><span className="mx-2 text-gray-300">|</span><button className="text-red-600 font-semibold text-xs">Disable</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
