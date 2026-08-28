/**
 * White card for dashboard analytics — sits on light grey bg under navy sidebar.
 */
export function StatsCard({ title, value, hint, accent }: { title: string; value: string; hint?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">{title}</p>
      <p className="text-2xl font-extrabold text-[#1A153B] mt-2">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {accent && <div className="mt-3 text-xs font-semibold text-emerald-600">{accent}</div>}
    </div>
  );
}
