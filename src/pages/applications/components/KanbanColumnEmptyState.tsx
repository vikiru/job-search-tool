import { Inbox } from 'lucide-react';

import { Empty, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';

interface KanbanColumnEmptyStateProps {
  message: string;
}

function KanbanColumnEmptyState({ message }: KanbanColumnEmptyStateProps) {
  return (
    <Empty className="min-h-32 rounded-lg border border-dashed border-border/80 bg-background/30 px-3 py-5">
      <EmptyMedia className="mb-0 text-muted-foreground/70" variant="default">
        <Inbox className="size-icon-base" aria-hidden="true" />
      </EmptyMedia>
      <EmptyTitle className="max-w-32 text-caption font-normal leading-relaxed text-muted-foreground">
        {message}
      </EmptyTitle>
    </Empty>
  );
}

export { KanbanColumnEmptyState };
