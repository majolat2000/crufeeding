'use client';
import { useState, useEffect, useMemo } from 'react';
import { getSession } from '@/lib/auth';
import { getUsers, updateUser, updateRole } from '@/lib/api';

type Role = 'user' | 'subscriber' | 'bursar' | 'super_admin';
type User = { id: string; email: string; fullname: string; matricNo?: string; role: Role; level?: string; hostel?: string; mealBreakfast: boolean; mealLunch: boolean; mealDinner: boolean; wallet?: { balance: number }; verified: boolean };

const ROLES_SUPER: Role[] = ['user', 'subscriber', 'bursar', 'super_admin'];
const ROLES_BURSAR: Role[] = ['user', 'subscriber', 'bursar'];

export default function UsersPage() {
  const session = getSession();
  const actorRole = (session?.role ?? 'super_admin') as Role;
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draftRole, setDraftRole] = useState<Role>('user');
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
    setDraftRole(u.role);
    setDraftMeals({ breakfast: u.mealBreakfast, lunch: u.mealLunch, dinner: u.mealDinner });
  }

  function canEdit(actor: Role, target: Role, next: Role): boolean {
    if (actor === 'super_admin') return true;
    if (actor === 'bursar') {
      if (target === 'super_admin') return false;
      return (ROLES_BURSAR as string[]).includes(next);
    }
    return false;
  }

  async function save(u: User) {
    if (!canEdit(actorRole, u.role, draftRole)) { alert('Permission denied'); return; }
    try {
      await updateUser(u.id, { role: draftRole, mealBreakfast: draftMeals.breakfast, mealLunch: draftMeals.lunch, mealDinner: draftMeals.dinner });
      setUsers(users.map(x => x.id === u.id ? { ...x, role: draftRole, mealBreakfast: draftMeals.breakfast, mealLunch: draftMeals.lunch, mealDinner: draftMeals.dinner } : x));
      setMsg(`Updated ${u.email}`);
      setEditing(null);
    } catch (e: any) { setMsg(e.message); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Users</h1>
          <p className="text-sm text-gray-500">Search by email, name, or matric &bull; Signed in as {actorRole}</p>
        </div>
      </div>

      {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2">{msg}</p>}

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search email, name, or matric..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-h-[60vh] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users from database...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500 sticky top-0">
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
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1A153B]">{u.fullname || u.email}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{u.matricNo || '\u2014'}</td>
                  <td className="px-4 py-3">
                    {editing === u.id ? (
                      <select value={draftRole} onChange={e => setDraftRole(e.target.value as Role)} className="border border-gray-200 rounded-lg px-2 py-1 text-sm">
                        {(actorRole === 'super_admin' ? ROLES_SUPER : ROLES_BURSAR).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'super_admin' ? 'bg-[#1A153B] text-white' : u.role === 'bursar' ? 'bg-amber-100 text-amber-800' : u.role === 'subscriber' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>}
                  </td>
                  <td className="px-4 py-3">
                    {editing === u.id && draftRole === 'subscriber' ? (
                      <div className="flex gap-2">
                        {(['breakfast', 'lunch', 'dinner'] as const).map(m => (
                          <label key={m} className="flex items-center gap-1 text-xs border rounded-full px-2 py-1">
                            <input type="checkbox" checked={draftMeals[m]} onChange={() => setDraftMeals({ ...draftMeals, [m]: !draftMeals[m] })} /> {m}
                          </label>
                        ))}
                      </div>
                    ) : u.role === 'subscriber' ? (
                      <span className="text-xs bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
                        {u.mealBreakfast ? 'B ' : ''}{u.mealLunch ? 'L ' : ''}{u.mealDinner ? 'D ' : ''}
                      </span>
                    ) : <span className="text-xs text-gray-400">\u2014</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-sm">\u20A6{Number(u.wallet?.balance ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    {editing === u.id ? (
                      <>
                        <button onClick={() => save(u)} className="text-emerald-600 font-bold text-xs mr-2">Save</button>
                        <button onClick={() => setEditing(null)} className="text-gray-500 text-xs">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => startEdit(u)} className="text-[#1A153B] font-bold text-xs">Edit</button>
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
      <p className="text-xs text-gray-500">Super Admin can set any role; Bursar can set User/Subscriber/Bursar only. Changes persist to PostgreSQL immediately.</p>
    </div>
  );
}
