import { DataTable } from '@/components/DataTable';

type Admin = { id: string; name: string; email: string; role: 'bursar'; status: 'Active' | 'Invited' };

const ROWS: Admin[] = [
  { id: '1', name: 'Dr. B. Alao', email: 'bursary@crawford.edu.ng', role: 'bursar', status: 'Active' },
  { id: '2', name: 'Mrs. K. Ojo', email: 'k.ojo@crawford.edu.ng', role: 'bursar', status: 'Active' },
];

/**
 * Admin management table — all Bursars have equal access.
 */
export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Admins</h1>
          <p className="text-sm text-gray-500 mt-1">Manage bursars</p>
        </div>
        <button className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Invite Bursar</button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          {
            key: 'role',
            header: 'Role',
            render: () => (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#1A153B] text-white">Bursar</span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{r.status}</span>,
          },
        ]}
        rows={ROWS}
      />
      <p className="text-xs text-gray-500">All bursars have equal access. Actions are logged to Activity Logs.</p>
    </div>
  );
}
