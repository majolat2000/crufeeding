'use client';
import { useState, useEffect } from 'react';
import { getSession } from '@/lib/auth';
import { getAdmins, updateRole, deleteUser, deductFromWallet } from '@/lib/api';

type Admin = { id: string; email: string; fullname: string; role: 'super_admin' | 'bursar' | 'user'; verified: boolean; createdAt: string };

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [deductStudentId, setDeductStudentId] = useState('');
  const [deductAmount, setDeductAmount] = useState('');
  const [deductReason, setDeductReason] = useState('');
  const [deductLoading, setDeductLoading] = useState(false);

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

  async function handleDeduct() {
    if (!deductStudentId || !deductAmount) { setMsg('Student ID and amount required'); return; }
    const amt = Number(deductAmount);
    if (amt <= 0) { setMsg('Amount must be positive'); return; }
    if (!confirm(`Deduct ₦${amt.toLocaleString()} from ${deductStudentId}?`)) return;
    setDeductLoading(true);
    try {
      const r = await deductFromWallet(deductStudentId, amt, deductReason || 'Admin deduction');
      setMsg(r.message || `Deducted ₦${amt.toLocaleString()}`);
      setDeductStudentId('');
      setDeductAmount('');
      setDeductReason('');
    } catch (e: any) { setMsg(e.message); } finally { setDeductLoading(false); }
  }

  return (
    <div className="space-y-6">
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

      {/* Deduction Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💸</span>
          <div>
            <h2 className="font-bold text-[#1A153B]">Deduction Panel</h2>
            <p className="text-xs text-gray-500">Deduct amounts from user wallets to correct erroneous funding</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Student ID / Matric No</label>
            <input
              value={deductStudentId}
              onChange={e => setDeductStudentId(e.target.value)}
              placeholder="Enter student ID or matric number"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Amount (₦)</label>
            <input
              type="number"
              value={deductAmount}
              onChange={e => setDeductAmount(e.target.value)}
              placeholder="0"
              min="1"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Reason (optional)</label>
            <input
              value={deductReason}
              onChange={e => setDeductReason(e.target.value)}
              placeholder="e.g. Erroneous funding correction"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleDeduct}
          disabled={deductLoading || !deductStudentId || !deductAmount}
          className="mt-4 bg-red-600 text-white rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-50 hover:bg-red-700 transition"
        >
          {deductLoading ? 'Processing...' : 'Deduct from Wallet'}
        </button>
      </div>
    </div>
  );
}
