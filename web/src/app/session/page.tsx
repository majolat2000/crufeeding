'use client';
import { getCurrentSession } from '@/lib/session';

export default function SessionPage() {
  const current = getCurrentSession();
  const next = `${parseInt(current.split('/')[0])+1}/${parseInt(current.split('/')[1])+1}`;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Session</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-700">Active academic session: <span className="font-extrabold text-[#1A153B]">{current}</span> (default 2026/2027)</p>
        <p className="text-xs text-gray-500 mt-2">Auto-rollover every <b>October 1st</b> → next session <b>{next}</b> on Oct 1, {current.split('/')[0]}+1. Logic: `getCurrentSession()` checks month ≥9.</p>
        <div className="mt-4 bg-[#F4F5F7] rounded-xl p-3 text-xs">SELECT * FROM transactions WHERE session = '{current}' • config.session updated by backend cron on Oct 1</div>
      </div>
    </div>
  );
}
