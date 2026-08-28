/**
 * Activity Logs — chronological feed (wraps legacy /logs)
 */
export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Activity Logs</h1>
      <p className="text-sm text-gray-500">Immutable audit trail — see /logs for full table. This route mirrors Activity Logs nav.</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-700">
        <p>Recent: bursary@crawford.edu.ng funded ₦75,000 to 1,842 wallets • levy ₦0 on funding.</p>
      </div>
    </div>
  );
}
