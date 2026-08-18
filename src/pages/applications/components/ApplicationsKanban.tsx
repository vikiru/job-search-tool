import { kanbanColumns, type ApplicationRecord } from '@/pages/applications/data';
import { KanbanColumn } from '@/pages/applications/components/KanbanColumn';

interface ApplicationsKanbanProps {
  applications: ApplicationRecord[];
  userId: string;
}

function ApplicationsKanban({ applications, userId }: ApplicationsKanbanProps) {
  return (
    <div className="space-y-4 p-3 sm:space-y-5 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-border/60 pb-4">
        <div className="min-w-0">
          <h2 className="font-heading text-p font-semibold leading-tight tracking-tight">Application pipeline</h2>
          <p className="mt-1 max-w-md text-small leading-relaxed text-muted-foreground">
            See where each opportunity stands and what is moving forward.
          </p>
        </div>
        <p className="font-mono text-caption tabular-nums text-muted-foreground" aria-live="polite">
          {applications.length} applications · {kanbanColumns.length} stages
        </p>
      </div>
      <div className="overflow-x-auto overscroll-x-contain pb-1">
        <div className="grid min-w-[760px] grid-cols-4 gap-3 pr-1 sm:min-w-[920px]">
          {kanbanColumns.map((column) => (
            <KanbanColumn key={column.id} applications={applications} column={column} userId={userId} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { ApplicationsKanban };
