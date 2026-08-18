import { History } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';

export function ApplicationActivityEmptyState() {
  return (
    <Empty className="min-h-28 rounded-lg border border-dashed border-border px-4 py-6">
      <EmptyMedia
        className="size-9 rounded-full bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-icon-sm"
        variant="icon"
      >
        <History className="size-icon-sm" aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>No activity yet</EmptyTitle>
        <EmptyDescription className="text-caption">
          Application updates will appear here as your search moves forward.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
