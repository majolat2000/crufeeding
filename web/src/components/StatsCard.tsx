import { LucideIcon } from 'lucide-react';

/**
 * White card for dashboard analytics — sits on light grey bg under navy sidebar.
 */
export function StatsCard({ 
  title, 
  value, 
  hint, 
  accent, 
  icon: Icon,
  iconColor = 'blue'
}: { 
  title: string; 
  value: string | number; 
  hint?: string; 
  accent?: { value: string; positive: boolean }; 
  icon?: LucideIcon;
  iconColor?: 'blue' | 'green' | 'amber' | 'purple';
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorMap[iconColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">{title}</p>
          <p className="text-2xl font-extrabold text-[#1A153B] mt-1">{value}</p>
          {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
          {accent && (
            <div className={`mt-3 text-xs font-semibold flex items-center gap-1 ${accent.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <span>{accent.positive ? '▲' : '▼'}</span>
              <span>{accent.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
