export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pulse w-full">
      <div className="aspect-[2/3] w-full bg-surface-hover rounded-lg"></div>
      <div className="h-4 bg-surface-hover rounded w-3/4"></div>
      <div className="h-3 bg-surface-hover rounded w-1/2"></div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="min-w-[150px] sm:min-w-[180px] lg:min-w-[200px]">
          <CardSkeleton />
        </div>
      ))}
    </div>
  );
}
