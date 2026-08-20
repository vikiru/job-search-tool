import { closestCorners, DndContext, DragOverlay, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMemo } from 'react';

import { kanbanColumns, type ApplicationRecord } from '@/entities/application/model';
import { useKanban } from '@/features/application-status/useKanban';
import { useKanbanDrag } from '@/features/application-status/useKanbanDrag';
import { KanbanColumn } from '@/pages/applications/components/KanbanColumn';
import { KanbanDragOverlay } from '@/pages/applications/components/KanbanDragOverlay';

const columnStatus = {
  SAVED: 'SAVED',
  IN_PROGRESS: 'APPLIED',
  ADVANCED: 'INTERVIEW',
  CLOSED: 'REJECTED',
} as const satisfies Record<(typeof kanbanColumns)[number]['id'], ApplicationRecord['status']>;

interface ApplicationsKanbanProps {
  applications: ApplicationRecord[];
  userId: string;
}

function ApplicationsKanban({ applications, userId }: ApplicationsKanbanProps) {
  const { activeId, clearActiveId, sensors, setActiveId } = useKanbanDrag();
  const { handleStatusChange, statusOverrides } = useKanban(userId);
  const displayedApplications = useMemo(
    () =>
      applications.map((application) => ({
        ...application,
        status: statusOverrides[application.id] ?? application.status,
      })),
    [applications, statusOverrides],
  );
  const activeApplication = displayedApplications.find((application) => application.id === activeId) ?? null;

  function handleDragEnd({ active, over }: DragEndEvent) {
    clearActiveId();
    if (!over || active.id === over.id) return;

    const application = displayedApplications.find((candidate) => candidate.id === active.id);
    const targetColumnId = findKanbanColumnId(String(over.id), displayedApplications);
    if (!application || !targetColumnId) return;

    const currentColumnId = findKanbanColumnId(application.id, displayedApplications);
    if (!currentColumnId || currentColumnId === targetColumnId) return;

    handleStatusChange(application, columnStatus[targetColumnId]);
  }

  return (
    <div className="space-y-4 p-3 sm:space-y-5 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-border/60 pb-4">
        <div className="min-w-0">
          <h2 className="font-heading text-p leading-tight font-semibold tracking-tight">Application pipeline</h2>
          <p className="mt-1 max-w-md text-small leading-relaxed text-muted-foreground">
            See where each opportunity stands and what is moving forward.
          </p>
        </div>
        <p className="font-mono text-caption text-muted-foreground tabular-nums" aria-live="polite">
          {applications.length} applications · {kanbanColumns.length} stages
        </p>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(String(active.id))}
        onDragCancel={clearActiveId}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto overscroll-x-contain pb-1">
          <div className="grid min-w-[760px] grid-cols-4 gap-3 pr-1 sm:min-w-[920px]">
            {kanbanColumns.map((column) => (
              <SortableContext
                key={column.id}
                items={displayedApplications
                  .filter((application) => isStatusInColumn(column, application.status))
                  .map((application) => application.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn
                  applications={displayedApplications}
                  column={column}
                  onStatusChange={handleStatusChange}
                  userId={userId}
                />
              </SortableContext>
            ))}
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          <KanbanDragOverlay application={activeApplication} userId={userId} />
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function isStatusInColumn(column: (typeof kanbanColumns)[number], status: ApplicationRecord['status']) {
  return (column.statuses as readonly ApplicationRecord['status'][]).includes(status);
}

function findKanbanColumnId(id: string, applicationRecords: ApplicationRecord[]) {
  const column = kanbanColumns.find((candidate) => candidate.id === id);
  if (column) return column.id;

  const application = applicationRecords.find((candidate) => candidate.id === id);
  return application
    ? kanbanColumns.find((candidate) => isStatusInColumn(candidate, application.status))?.id
    : undefined;
}

export { ApplicationsKanban };
