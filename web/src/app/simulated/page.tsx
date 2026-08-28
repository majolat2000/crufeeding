'use client';
export default function SimulatedPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Simulated Transactions</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-700">Generate test QR payments to validate levy split (10%) without real wallets.</p>
        <button className="mt-4 border border-[#1A153B] text-[#1A153B] px-6 py-3 rounded-xl font-bold">Simulate 100 Payments</button>
      </div>
    </div>
  );
}
