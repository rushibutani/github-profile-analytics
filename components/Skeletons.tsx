export function ProfileSkeleton() {
  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted/20 rounded-lg" />
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="h-8 bg-muted/20 rounded w-48" />
            <div className="h-4 bg-muted/20 rounded w-32" />
          </div>
          <div className="h-16 bg-muted/20 rounded w-full max-w-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-muted/20 rounded w-16" />
                <div className="h-4 bg-muted/20 rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-muted/20 rounded w-48" />
        <div className="h-4 bg-muted/20 rounded w-32" />
      </div>
      <div className="h-64 bg-muted/20 rounded" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-muted/20 rounded w-48" />
        <div className="h-10 bg-muted/20 rounded w-64" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted/20 rounded" />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <ProfileSkeleton />
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <ChartSkeleton />
      <TableSkeleton />
    </div>
  );
}
