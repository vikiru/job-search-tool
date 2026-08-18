import { useEffect, useMemo, useRef, useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'sonner';

import { useUpdateApplicationStatusForUser } from '@/features/applications/hooks/useApplicationMutations';
import { formatStatus, kanbanColumns, type ApplicationRecord, type ApplicationStatus } from '@/pages/applications/data';
import { KanbanColumn } from '@/pages/applications/components/KanbanColumn';
import { KanbanDragOverlay } from '@/pages/applications/components/KanbanDragOverlay';

const DRAG_DEBOUNCE_MS = 400;

const columnStatus = {
  SAVED: 'SAVED',
  IN_PROGRESS: 'APPLIED',
  ADVANCED: 'INTERVIEW',
  CLOSED: 'REJECTED',
} as const satisfies Record<(typeof kanbanColumns)[number]['id'], ApplicationRecord['status']>;

interface PendingStatusChange {
  originalStatus: ApplicationRecord['status'];
  nextStatus: ApplicationRecord['status'];
}

interface ApplicationsKanbanProps {
  applications: ApplicationRecord[];
  userId: string;
}

function ApplicationsKanban({ applications, userId }: ApplicationsKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ApplicationRecord['status']>>({});
  const statusMutation = useUpdateApplicationStatusForUser(userId);
  const pendingChanges = useRef(new Map<string, PendingStatusChange>());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const displayedApplications = useMemo(
    () =>
      applications.map((application) => ({
        ...application,
        status: statusOverrides[application.id] ?? application.status,
      })),
    [applications, statusOverrides],
  );
  const activeApplication = displayedApplications.find((application) => application.id === activeId) ?? null;

  useEffect(() => {
    return () => {
      for (const timer of timers.current.values()) clearTimeout(timer);
    };
  }, []);

  function getColumnId(id: string) {
    const column = kanbanColumns.find((candidate) => candidate.id === id);
    if (column) return column.id;

    const application = displayedApplications.find((candidate) => candidate.id === id);
    return application
      ? kanbanColumns.find((candidate) => isStatusInColumn(candidate, application.status))?.id
      : undefined;
  }

  function scheduleStatusChange(application: ApplicationRecord, nextStatus: ApplicationRecord['status']) {
    const existing = pendingChanges.current.get(application.id);
    const originalStatus = existing?.originalStatus ?? application.status;
    const previousTimer = timers.current.get(application.id);
    if (previousTimer) clearTimeout(previousTimer);

    pendingChanges.current.set(application.id, { nextStatus, originalStatus });
    const timer = setTimeout(() => {
      void persistStatusChange(application, nextStatus, originalStatus);
    }, DRAG_DEBOUNCE_MS);
    timers.current.set(application.id, timer);
  }

  async function persistStatusChange(
    application: ApplicationRecord,
    nextStatus: ApplicationRecord['status'],
    originalStatus: ApplicationRecord['status'],
  ) {
    const result = await statusMutation.mutateAsync({ id: application.id, status: nextStatus });
    const pending = pendingChanges.current.get(application.id);
    if (!pending || pending.nextStatus !== nextStatus) return;

    pendingChanges.current.delete(application.id);
    timers.current.delete(application.id);

    if (!result.success) {
      setStatusOverrides((current) => {
        const next = { ...current };
        delete next[application.id];
        return next;
      });
      toast.error('Application status was not saved.', {
        description: `Application remains ${formatStatus(originalStatus)}.`,
      });
      return;
    }

    setStatusOverrides((current) => {
      const next = { ...current };
      delete next[application.id];
      return next;
    });
    toast.success('Application moved.', {
      description: `Application changed from ${formatStatus(originalStatus)} to ${formatStatus(nextStatus)}.`,
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const application = displayedApplications.find((candidate) => candidate.id === active.id);
    const targetColumnId = getColumnId(String(over.id));
    if (!application || !targetColumnId) return;

    const currentColumnId = getColumnId(application.id);
    if (!currentColumnId || currentColumnId === targetColumnId) return;

    handleStatusChange(application, columnStatus[targetColumnId]);
  }

  function handleStatusChange(application: ApplicationRecord, nextStatus: ApplicationStatus) {
    if (application.status === nextStatus) return;
    setStatusOverrides((current) => ({ ...current, [application.id]: nextStatus }));
    scheduleStatusChange(application, nextStatus);
  }

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(String(active.id))}
        onDragCancel={() => setActiveId(null)}
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

export { ApplicationsKanban };
