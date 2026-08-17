import { Inbox } from 'lucide-react';

interface KanbanColumnEmptyStateProps {
  message: string;
}

function KanbanColumnEmptyState({ message }: KanbanColumnEmptyStateProps) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-background/30 px-3 py-5 text-center">
      <Inbox className="size-icon-base text-muted-foreground/70" aria-hidden="true" />
      <p className="mt-2 max-w-32 text-caption leading-relaxed text-muted-foreground">{message}</p>
    </div>
  );
}

export { KanbanColumnEmptyState };
