export default function BackupPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Backup</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-700">Export ledger + wallets • nightly Mongo dump to S3.</p>
        <button className="mt-4 bg-[#1A153B] text-white px-6 py-3 rounded-xl font-bold">Download Backup (CSV + JSON)</button>
      </div>
    </div>
  );
}
