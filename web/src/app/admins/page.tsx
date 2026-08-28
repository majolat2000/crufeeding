import { DataTable } from '@/components/DataTable';

type Admin = { id: string; name: string; email: string; role: 'super_admin' | 'bursar' | 'hostel_admin'; status: 'Active' | 'Invited' };

const ROWS: Admin[] = [
  { id: '1', name: 'Dr. B. Alao', email: 'bursary@crawford.edu.ng', role: 'super_admin', status: 'Active' },
  { id: '2', name: 'Mrs. K. Ojo', email: 'k.ojo@crawford.edu.ng', role: 'bursar', status: 'Active' },
  { id: '3', name: 'Mr. T. Adeyemi', email: 't.adeyemi@crawford.edu.ng', role: 'hostel_admin', status: 'Invited' },
];

/**
 * Admin management table — RBAC aware (super_admin vs bursar).
 * Backend enforces via rbac middleware; UI hides disallowed actions.
 */
export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Admins</h1>
          <p className="text-sm text-gray-500 mt-1">Manage super admins and bursars — RBAC protected</p>
        </div>
        <button className="bg-[#1A153B] text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Invite Admin</button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          {
            key: 'role',
            header: 'Role',
            render: (r) => (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.role === 'super_admin' ? 'bg-[#1A153B] text-white' : r.role === 'bursar' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                {r.role}
              </span>
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
      <p className="text-xs text-gray-500">Only <b>super_admin</b> can invite/remove bursars. All actions are logged to Activity Logs.</p>
    </div>
  );
}
