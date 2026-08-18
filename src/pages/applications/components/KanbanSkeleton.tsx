import { Skeleton } from '@/shared/components/ui/skeleton';

export function KanbanSkeleton() {
  return (
    <div
      className="grid min-w-[760px] grid-cols-4 gap-3 p-3 sm:min-w-[920px] sm:p-5"
      aria-label="Loading application pipeline"
    >
      {Array.from({ length: 4 }, (__, columnIndex) => (
        <div key={columnIndex} className="space-y-3 rounded-xl border border-border/60 bg-muted/45 p-3">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-6 rounded-full" />
          </div>
          {Array.from({ length: 3 }, (_, cardIndex) => (
            <div key={cardIndex} className="space-y-3 rounded-lg border border-border/60 bg-card p-4">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
