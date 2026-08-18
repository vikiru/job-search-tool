import { Activity } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';

function RecentActivityEmptyState() {
  return (
    <Empty className="min-h-52 rounded-lg border border-dashed border-border px-4 py-8">
      <EmptyMedia
        className="size-10 rounded-full bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-icon-base"
        variant="icon"
      >
        <Activity className="size-icon-base" aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>No activity yet</EmptyTitle>
        <EmptyDescription className="max-w-xs text-caption">
          Add an application or update its status to start building your search history.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export { RecentActivityEmptyState };
