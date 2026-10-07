'use client';
import { useState, useEffect, useMemo } from 'react';
import { getSession } from '@/lib/auth';
import { getUsers, updateUser } from '@/lib/api';

type Role = 'student' | 'bursar' | 'hostel_admin' | 'vendor';
type User = { id: string; email: string; fullname: string; matricNo?: string; role: Role; hostel?: string; mealBreakfast: boolean; mealLunch: boolean; mealDinner: boolean; wallet?: { balance: number }; verified: boolean };

const ROLES: Role[] = ['student', 'bursar'];

export default function UsersPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draftRole, setDraftRole] = useState<Role>('student');
  const [draftMeals, setDraftMeals] = useState<{ breakfast: boolean; lunch: boolean; dinner: boolean }>({ breakfast: false, lunch: false, dinner: false });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getUsers()
      .then((r) => { setUsers(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(u => !q || u.email.toLowerCase().includes(q) || (u.fullname || '').toLowerCase().includes(q) || (u.matricNo || '').toLowerCase().includes(q));
  }, [users, query]);

  function startEdit(u: User) {
    setEditing(u.id);
    setDraftRole(u.role === 'bursar' ? 'student' : u.role);
    setDraftMeals({ breakfast: u.mealBreakfast, lunch: u.mealLunch, dinner: u.mealDinner });
  }

  async function save(u: User) {
    const payload: any = { role: draftRole, mealBreakfast: draftMeals.breakfast, mealLunch: draftMeals.lunch, mealDinner: draftMeals.dinner };
    try {
      await updateUser(u.id, payload);
      const updated = { ...u, role: draftRole, mealBreakfast: draftMeals.breakfast, mealLunch: draftMeals.lunch, mealDinner: draftMeals.dinner };
      setUsers(users.map(x => x.id === u.id ? updated : x));
      setMsg(`Updated ${u.email}`);
      setEditing(null);
    } catch (e: any) { setMsg(e.message); }
  }

  function roleBadge(role: Role) {
    if (role === 'bursar') return 'bg-blue-600 text-white';
    if (role === 'student') return 'bg-emerald-100 text-emerald-800';
    return 'bg-gray-100 text-gray-700';
  }

  function roleLabel(role: Role) {
    return role;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Search by email, name, or matric</p>
        </div>
      </div>

      {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2">{msg}</p>}

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search email, name, or matric..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-auto max-h-[60vh]">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users from database...</div>
        ) : (
          <table className="w-full text-sm divide-y divide-gray-100 min-w-[800px]">
            <thead className="bg-gray-50/80 text-xs uppercase tracking-widest text-gray-500 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Matric</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-right px-4 py-3">Balance</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{u.fullname || u.email}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{u.matricNo || '\u2014'}</td>
                  <td className="px-4 py-3">
                    {editing === u.id ? (
                      <select value={draftRole} onChange={e => setDraftRole(e.target.value as Role)} className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : <span className={`px-2 py-1 rounded-full text-xs font-bold ${roleBadge(u.role)}`}>{roleLabel(u.role)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    {editing === u.id && draftRole === 'student' ? (
                      <div className="flex flex-wrap gap-2">
                        {(['breakfast', 'lunch', 'dinner'] as const).map(m => (
                          <label key={m} className="flex items-center gap-1 text-xs border rounded-full px-2 py-1 bg-white whitespace-nowrap">
                            <input type="checkbox" checked={draftMeals[m]} onChange={() => setDraftMeals({ ...draftMeals, [m]: !draftMeals[m] })} className="accent-blue-600" /> {m}
                          </label>
                        ))}
                      </div>
                    ) : u.role === 'student' ? (
                      <span className="text-xs bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
                        {u.mealBreakfast ? 'B ' : ''}{u.mealLunch ? 'L ' : ''}{u.mealDinner ? 'D ' : ''}
                      </span>
                    ) : <span className="text-xs text-gray-400">None</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-sm">₦{Number(u.wallet?.balance ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    {editing === u.id ? (
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => save(u)} className="text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded hover:bg-emerald-100 transition-colors">Save</button>
                        <button onClick={() => setEditing(null)} className="text-gray-500 font-bold text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(u)} className="text-blue-600 font-bold text-xs px-3 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors">Edit</button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No users found in database</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
