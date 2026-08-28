'use client';
export default function FundWalletsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Fund Wallets</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-700">Trigger funding for valid (verified) students. Uses global Feeding Amount from Settings.</p>
        <button className="mt-4 bg-[#1A153B] text-white px-6 py-3 rounded-xl font-bold">Fund Valid Students — ₦75,000 each</button>
      </div>
    </div>
  );
}
