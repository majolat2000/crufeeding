'use client';
import { useState, useEffect } from 'react';
import { getSession } from '@/lib/auth';
import { getAdmins, updateRole, deleteUser } from '@/lib/api';

type Admin = { id: string; email: string; fullname: string; role: 'super_admin' | 'bursar' | 'user'; verified: boolean; createdAt: string };

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getAdmins()
      .then(r => setAdmins(r.data || []))
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleRoleChange(a: Admin) {
    const newRole = a.role === 'bursar' ? 'user' : 'bursar';
    try {
      await updateRole(a.id, newRole);
      setAdmins(admins.map(x => x.id === a.id ? { ...x, role: newRole as any } : x));
      setMsg(`Updated ${a.email} to ${newRole}`);
    } catch (e: any) { setMsg(e.message); }
  }

  async function handleRemove(a: Admin) {
    if (!confirm(`Remove ${a.email}?`)) return;
    try {
      await deleteUser(a.id);
      setAdmins(admins.filter(x => x.id !== a.id));
      setMsg(`Removed ${a.email}`);
    } catch (e: any) { setMsg(e.message); }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Admin</h1>

      {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2">{msg}</p>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading admins from database...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold">{a.fullname || '—'}</td>
                  <td className="px-4 py-3 text-xs">{a.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${(a.role === 'super_admin' || a.role === 'bursar') ? 'bg-[#1A153B] text-white' : 'bg-amber-100 text-amber-800'}`}>
                      {a.role === 'super_admin' ? 'Bursar' : a.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleRoleChange(a)} className="text-[#1A153B] font-bold text-xs mr-2">
                      {a.role === 'bursar' ? 'Demote to User' : 'Promote'}
                    </button>
                    <button onClick={() => handleRemove(a)} className="text-red-600 font-bold text-xs">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
