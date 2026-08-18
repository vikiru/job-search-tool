import {
  formatStatus,
  kanbanColumns,
  type ApplicationRecord,
  type ApplicationStatus,
} from '@/pages/applications/application-model';
import { KanbanCard } from '@/pages/applications/components/KanbanCard';
import { KanbanColumnEmptyState } from '@/pages/applications/components/KanbanColumnEmptyState';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useDroppable } from '@dnd-kit/core';

type KanbanColumnDefinition = (typeof kanbanColumns)[number];

const columnStyles = {
  SAVED: {
    accent: 'border-t-primary',
    count: 'bg-primary/10 text-primary',
  },
  IN_PROGRESS: {
    accent: 'border-t-sky-500',
    count: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  },
  ADVANCED: {
    accent: 'border-t-amber-500',
    count: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  CLOSED: {
    accent: 'border-t-muted-foreground/50',
    count: 'bg-muted text-muted-foreground',
  },
} as const;

const emptyColumnMessages = {
  SAVED: 'No saved roles yet',
  IN_PROGRESS: 'No applications in progress',
  ADVANCED: 'No interviews or offers yet',
  CLOSED: 'Nothing closed yet',
} as const;

interface KanbanColumnProps {
  applications: ApplicationRecord[];
  column: KanbanColumnDefinition;
  onStatusChange: (application: ApplicationRecord, status: ApplicationStatus) => void;
  userId: string;
}

function KanbanColumn({ applications, column, onStatusChange, userId }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id, data: { type: 'column', columnId: column.id } });
  const statusApplications = applications.filter((application) =>
    column.statuses.some((status) => status === application.status),
  );
  const styles = columnStyles[column.id];

  return (
    <section
      ref={setNodeRef}
      className={`min-w-0 rounded-xl border border-border/60 border-t bg-muted/45 p-2 transition-colors motion-reduce:transition-none ${styles.accent} ${
        isOver ? 'bg-primary/5 ring-2 ring-primary/20' : ''
      }`}
      aria-labelledby={`kanban-${column.id}`}
    >
      <header className="flex min-h-16 items-start justify-between gap-2 px-2 py-2">
        <div className="min-w-0">
          <h2 id={`kanban-${column.id}`} className="truncate font-heading text-small font-semibold tracking-tight">
            {column.label}
          </h2>
          <p className="mt-1 truncate text-caption text-muted-foreground">
            {column.statuses.map(formatStatus).join(' · ')}
          </p>
        </div>
        <span
          className={`inline-flex min-w-7 shrink-0 items-center justify-center rounded-full px-2 py-1 font-mono text-caption font-medium tabular-nums ${styles.count}`}
        >
          {statusApplications.length}
        </span>
      </header>
      <ScrollArea className="h-72 min-h-40 pr-2 sm:h-96">
        <div className="space-y-2.5">
          {statusApplications.map((application) => (
            <KanbanCard
              key={application.id}
              application={application}
              availableStatuses={column.statuses}
              onStatusChange={(status) => onStatusChange(application, status)}
              userId={userId}
            />
          ))}
          {statusApplications.length === 0 && (
            <KanbanColumnEmptyState columnId={column.id} message={emptyColumnMessages[column.id]} />
          )}
        </div>
      </ScrollArea>
    </section>
  );
}

export { KanbanColumn };
