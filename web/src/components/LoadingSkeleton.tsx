'use client';

export function SkeletonText({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SkeletonText className="h-4 w-24" />
        <SkeletonText className="h-8 w-8 rounded-lg" />
      </div>
      <SkeletonText className="h-8 w-32" />
      <SkeletonText className="h-3 w-40 mt-2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonText key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 items-center">
            {[1, 2, 3, 4, 5].map((j) => (
              <SkeletonText key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded bg-white border border-gray-200 shadow-sm ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Main charts/tables area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonTable rows={6} />
        </div>
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-[400px]">
          <SkeletonText className="h-5 w-32 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <SkeletonText className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <SkeletonText className="h-4 w-full" />
                  <SkeletonText className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
