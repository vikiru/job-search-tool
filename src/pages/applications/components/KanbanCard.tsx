/* oxlint-disable jsx_a11y/no-noninteractive-tabindex -- dnd-kit uses this focusable drag surface for keyboard dragging. */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@tanstack/react-router';

import { formatApplicationDate, type ApplicationRecord, type ApplicationStatus } from '@/entities/application/model';
import { ApplicationActionMenu } from '@/pages/applications/components/ApplicationActionMenu';
import { InterestRating } from '@/pages/applications/components/InterestRating';
import { KanbanStatusSelect } from '@/pages/applications/components/KanbanStatusSelect';
import { StatusBadge } from '@/pages/applications/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface KanbanCardProps {
  application: ApplicationRecord;
  availableStatuses?: readonly ApplicationStatus[];
  onStatusChange?: (status: ApplicationStatus) => void;
  userId: string;
  isOverlay?: boolean;
}

function KanbanCard({ application, availableStatuses, onStatusChange, userId, isOverlay = false }: KanbanCardProps) {
  if (isOverlay) return <KanbanCardContent application={application} userId={userId} isOverlay />;

  return (
    <SortableKanbanCard
      application={application}
      availableStatuses={availableStatuses}
      onStatusChange={onStatusChange}
      userId={userId}
    />
  );
}

function SortableKanbanCard({
  application,
  availableStatuses,
  onStatusChange,
  userId,
}: Omit<KanbanCardProps, 'isOverlay'>) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: application.id,
    data: { type: 'application', application },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-30' : undefined}
      tabIndex={0}
      aria-label={`Move ${application.position} at ${application.company}`}
    >
      <KanbanCardContent
        application={application}
        availableStatuses={availableStatuses}
        onStatusChange={onStatusChange}
        userId={userId}
      />
    </div>
  );
}

function KanbanCardContent({
  application,
  availableStatuses,
  onStatusChange,
  userId,
  isOverlay = false,
}: KanbanCardProps) {
  return (
    <Card
      size="sm"
      className={`gap-3 border-border/70 bg-card shadow-xs transition-[border-color,box-shadow] hover:border-border motion-reduce:transition-none ${
        isOverlay ? 'rotate-2 shadow-lg' : ''
      }`}
    >
      <CardHeader className="gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="truncate font-heading text-small font-semibold tracking-tight">
              <Link
                className="transition-colors hover:text-primary motion-reduce:transition-none"
                to="/applications/$id"
                params={{ id: application.id }}
              >
                {application.company}
              </Link>
            </CardTitle>
            <Link
              className="mt-1 line-clamp-2 text-caption leading-relaxed text-muted-foreground transition-colors hover:text-primary motion-reduce:transition-none"
              to="/applications/$id"
              params={{ id: application.id }}
            >
              {application.position}
            </Link>
          </div>
          <ApplicationActionMenu application={application} context="kanban" userId={userId} />
        </div>
        <div className="flex min-w-0 items-center justify-between gap-2">
          {onStatusChange && availableStatuses ? (
            <KanbanStatusSelect onChange={onStatusChange} statuses={availableStatuses} value={application.status} />
          ) : (
            <StatusBadge status={application.status} />
          )}
          <InterestRating value={application.interestRating} />
        </div>
      </CardHeader>
      <CardContent className="border-t border-border/60 pt-3">
        <p className="truncate text-caption text-muted-foreground">
          {application.location} <span aria-hidden="true">·</span> {formatApplicationDate(application.applicationDate)}
        </p>
      </CardContent>
    </Card>
  );
}

export { KanbanCard };
