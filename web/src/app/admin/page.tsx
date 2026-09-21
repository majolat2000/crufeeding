'use client';
import { useState, useEffect } from 'react';
import { getSession } from '@/lib/auth';
import { getAdmins, updateRole, deleteUser, deductFromWallet, resetUserCredential } from '@/lib/api';

type Admin = { id: string; email: string; fullname: string; role: 'bursar' | 'student'; verified: boolean; createdAt: string };

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [deductStudentId, setDeductStudentId] = useState('');
  const [deductAmount, setDeductAmount] = useState('');
  const [deductReason, setDeductReason] = useState('');
  const [deductLoading, setDeductLoading] = useState(false);

  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetType, setResetType] = useState<'password' | 'pin'>('password');
  const [resetValue, setResetValue] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    getAdmins()
      .then(r => setAdmins(r.data || []))
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleRoleChange(a: Admin) {
    const newRole = a.role === 'bursar' ? 'student' : 'bursar';
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
    if (!deductStudentId || !deductAmount) { setMsg('Email/matric number and amount required'); return; }
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

  async function handleResetCredential() {
    if (!resetIdentifier || !resetValue) { setMsg('User identifier and new value required'); return; }
    if (resetType === 'password' && resetValue.length < 6) { setMsg('Password must be at least 6 characters'); return; }
    if (resetType === 'pin' && !/^\d{4,6}$/.test(resetValue)) { setMsg('PIN must be 4-6 digits'); return; }
    if (!confirm(`Reset ${resetType} for ${resetIdentifier}?`)) return;
    setResetLoading(true);
    try {
      const r = await resetUserCredential(resetIdentifier, resetType, resetValue);
      setMsg(r.message || `${resetType} reset successfully`);
      setResetIdentifier('');
      setResetValue('');
    } catch (e: any) { setMsg(e.message); } finally { setResetLoading(false); }
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
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${a.role === 'bursar' ? 'bg-[#1A153B] text-white' : 'bg-amber-100 text-amber-800'}`}>
                      {a.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleRoleChange(a)} className="text-[#1A153B] font-bold text-xs mr-2">
                      {a.role === 'bursar' ? 'Demote to Student' : 'Promote to Bursar'}
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
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Email / Matric No</label>
            <input
              value={deductStudentId}
              onChange={e => setDeductStudentId(e.target.value)}
              placeholder="Enter email or matric number"
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

      {/* Reset Credential Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔑</span>
          <div>
            <h2 className="font-bold text-[#1A153B]">Reset User Credential</h2>
            <p className="text-xs text-gray-500">Reset a user&apos;s password or transaction PIN using their email or matric number</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Email / Matric No</label>
            <input
              value={resetIdentifier}
              onChange={e => setResetIdentifier(e.target.value)}
              placeholder="Enter email or matric number"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">Reset Type</label>
            <select
              value={resetType}
              onChange={e => setResetType(e.target.value as 'password' | 'pin')}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
            >
              <option value="password">Password</option>
              <option value="pin">Transaction PIN</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-500">New {resetType === 'password' ? 'Password' : 'PIN'}</label>
            <input
              value={resetValue}
              onChange={e => setResetValue(e.target.value)}
              placeholder={resetType === 'password' ? 'Min 6 characters' : '4-6 digits'}
              type={resetType === 'password' ? 'password' : 'text'}
              maxLength={resetType === 'pin' ? 6 : undefined}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleResetCredential}
          disabled={resetLoading || !resetIdentifier || !resetValue}
          className="mt-4 bg-[#1A153B] text-white rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-50 hover:bg-[#2a2550] transition"
        >
          {resetLoading ? 'Processing...' : `Reset ${resetType === 'password' ? 'Password' : 'PIN'}`}
        </button>
      </div>
    </div>
  );
}
