import { useDroppable } from '@dnd-kit/core';
import { Inbox } from 'lucide-react';

import { Empty, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';

interface KanbanColumnEmptyStateProps {
  columnId: string;
  message: string;
}

function KanbanColumnEmptyState({ columnId, message }: KanbanColumnEmptyStateProps) {
  const { isOver, setNodeRef } = useDroppable({ id: columnId, data: { type: 'column', columnId } });

  return (
    <Empty
      ref={setNodeRef}
      className={`min-h-32 rounded-lg border border-dashed px-3 py-5 transition-colors motion-reduce:transition-none ${
        isOver ? 'border-primary bg-primary/10' : 'border-border/80 bg-background/30'
      }`}
    >
      <EmptyMedia className="mb-0 text-muted-foreground/70" variant="default">
        <Inbox className="size-icon-sm" aria-hidden="true" />
      </EmptyMedia>
      <EmptyTitle className="max-w-32 text-caption leading-relaxed font-normal text-muted-foreground">
        {message}
      </EmptyTitle>
    </Empty>
  );
}

export { KanbanColumnEmptyState };
