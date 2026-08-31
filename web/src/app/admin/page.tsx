'use client';
import { useState } from 'react';
import { getSession } from '@/lib/auth';

type Admin = { id:string; name:string; email:string; role:'super_admin'|'bursar' };

const MOCK: Admin[] = [
  { id:'1', name:'Majesty Olatimilehin', email:'majesty.olatimilehin@crawforduniversity.edu.ng', role:'super_admin'},
  { id:'2', name:'Bursar One', email:'bursar1@crawford.edu.ng', role:'bursar'},
];

export default function AdminPage() {
  const actor = (getSession()?.role ?? 'super_admin') as 'super_admin'|'bursar';
  const [admins, setAdmins] = useState<Admin[]>(MOCK);

  function canManage(target: Admin) {
    if (actor==='super_admin') return true;
    if (actor==='bursar') return target.role==='bursar'; // can only manage bursars
    return false;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Admin</h1>
      <p className="text-sm text-gray-500">Signed in as <b>{actor}</b> • Bursars can only manage Bursars/Users</p>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500"><tr><th className="text-left px-4 py-3">Name</th><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">Role</th><th className="text-right px-4 py-3">Actions</th></tr></thead>
          <tbody>
            {admins.map(a=>(
              <tr key={a.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{a.name}</td>
                <td className="px-4 py-3 text-xs">{a.email}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${a.role==='super_admin'?'bg-[#1A153B] text-white':'bg-amber-100 text-amber-800'}`}>{a.role}</span></td>
                <td className="px-4 py-3 text-right">
                  {canManage(a) ? (
                    <><button onClick={()=>setAdmins(admins.map(x=>x.id===a.id?{...x,role: x.role==='bursar'?'super_admin':'bursar'}:x))} className="text-[#1A153B] font-bold text-xs mr-2">{a.role==='bursar'?'Promote':'Demote'}</button><button onClick={()=>setAdmins(admins.filter(x=>x.id!==a.id))} className="text-red-600 font-bold text-xs">Remove</button></>
                  ) : <span className="text-xs text-gray-400">No permission</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">Super Admin can degrade/remove any admin; Bursar can only degrade/remove Bursars (to User).</p>
    </div>
  );
}
