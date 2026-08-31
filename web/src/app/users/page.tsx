'use client';
import { useState, useMemo } from 'react';
import { getSession } from '@/lib/auth';

type Role = 'user' | 'subscriber' | 'bursar' | 'super_admin';
type Meal = 'Breakfast' | 'Lunch' | 'Dinner';
type User = { id: string; name: string; email: string; matric: string; role: Role; meals: Meal[] };

const MOCK: User[] = [
  { id: '1', name: 'Majesty Olatimilehin', email: 'majesty@crawford.edu.ng', matric: 'CRU1234567', role: 'subscriber', meals: ['Breakfast','Lunch','Dinner'] },
  { id: '2', name: 'John Doe', email: 'john@crawford.edu.ng', matric: '21234567', role: 'user', meals: [] },
  { id: '3', name: 'Aisha Bello', email: 'aisha@crawford.edu.ng', matric: 'CRU7654321', role: 'bursar', meals: [] },
  { id: '4', name: 'Musa Admin', email: 'majesty.olatimilehin@crawforduniversity.edu.ng', matric: 'CRU0000001', role: 'super_admin', meals: [] },
  { id: '5', name: 'Visitor One', email: 'visitor1@gmail.com', matric: '—', role: 'user', meals: [] },
];

const ROLES_SUPER: Role[] = ['user','subscriber','bursar','super_admin'];
const ROLES_BURSAR: Role[] = ['user','subscriber','bursar'];

function isValidMatric(m: string) {
  if (m === '—' || m === '' ) return true; // Visitor
  return /^CRU\d{7}$/.test(m) || /^2\d{7}$/.test(m);
}

function canEdit(actor: Role, target: Role, next: Role): boolean {
  if (actor === 'super_admin') return true; // can degrade anyone, including fellow super_admin
  if (actor === 'bursar') {
    if (target === 'super_admin') return false;
    // bursar can only set to user/subscriber/bursar and degrade bursars to user
    return (ROLES_BURSAR as string[]).includes(next);
  }
  return false;
}

export default function UsersPage() {
  const session = getSession();
  const actorRole = (session?.role ?? 'super_admin') as Role;
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>(MOCK);
  const [editing, setEditing] = useState<string|null>(null);
  const [draftRole, setDraftRole] = useState<Role>('user');
  const [draftMeals, setDraftMeals] = useState<Meal[]>([]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(u => !q || u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.matric.toLowerCase().includes(q));
  }, [users, query]);

  function startEdit(u: User) { setEditing(u.id); setDraftRole(u.role); setDraftMeals([...u.meals]); }
  function toggleMeal(m: Meal) { setDraftMeals(prev => prev.includes(m) ? prev.filter(x=>x!==m) : [...prev, m]); }

  function save(u: User) {
    if (!isValidMatric(u.matric)) { alert(`Invalid Matric/Reg No ${u.matric}: must be CRU******* or 2********`); return; }
    if (!canEdit(actorRole, u.role, draftRole)) { alert('Permission denied for this role change'); return; }
    if (draftRole === 'subscriber' && draftMeals.length===0) { alert('Select at least one meal for Subscriber'); return; }
    setUsers(users.map(x => x.id===u.id ? { ...x, role: draftRole, meals: draftRole==='subscriber' ? draftMeals : [] } : x));
    console.log('[activity] ROLE_UPDATE', { actor: session?.email, target: u.email, from: u.role, to: draftRole, meals: draftMeals });
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A153B]">Users</h1>
          <p className="text-sm text-gray-500">Search by email, full name, or Matric/Reg No (CRU******* / 2********) • Signed in as {actorRole}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search email, full name, or matric (CRU... / 2...)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-h-[60vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500 sticky top-0">
            <tr><th className="text-left px-4 py-3">User</th><th className="text-left px-4 py-3">Matric/Reg No</th><th className="text-left px-4 py-3">Role</th><th className="text-left px-4 py-3">Plan</th><th className="text-right px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="px-4 py-3"><p className="font-semibold text-[#1A153B]">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></td>
                <td className="px-4 py-3 font-mono text-xs">{u.matric}</td>
                <td className="px-4 py-3">
                  {editing===u.id ? (
                    <select value={draftRole} onChange={e=>setDraftRole(e.target.value as Role)} className="border border-gray-200 rounded-lg px-2 py-1 text-sm">
                      {(actorRole==='super_admin' ? ROLES_SUPER : ROLES_BURSAR).map(r=> <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role==='super_admin'?'bg-[#1A153B] text-white':u.role==='bursar'?'bg-amber-100 text-amber-800':u.role==='subscriber'?'bg-emerald-100 text-emerald-800':'bg-gray-100 text-gray-700'}`}>{u.role}</span>}
                </td>
                <td className="px-4 py-3">
                  {editing===u.id && draftRole==='subscriber' ? (
                    <div className="flex gap-2">
                      {(['Breakfast','Lunch','Dinner'] as Meal[]).map(m => (
                        <label key={m} className="flex items-center gap-1 text-xs border rounded-full px-2 py-1">
                          <input type="checkbox" checked={draftMeals.includes(m)} onChange={()=>toggleMeal(m)} /> {m}
                        </label>
                      ))}
                    </div>
                  ) : u.role==='subscriber' ? <span className="text-xs bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">{u.meals.join(', ')||'—'}</span> : <span className="text-xs text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  {editing===u.id ? (
                    <><button onClick={()=>save(u)} className="text-emerald-600 font-bold text-xs mr-2">Save</button><button onClick={()=>setEditing(null)} className="text-gray-500 text-xs">Cancel</button></>
                  ) : (
                    <button onClick={()=>startEdit(u)} className="text-[#1A153B] font-bold text-xs">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">Super Admin can set User/Subscriber/Bursar/Super Admin; Bursar can set User/Subscriber/Bursar only. Subscriber requires at least one meal tick.</p>
    </div>
  );
}
