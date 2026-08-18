import { Link } from '@tanstack/react-router';

import { ApplicationActionMenu } from '@/pages/applications/components/ApplicationActionMenu';
import { InterestRating } from '@/pages/applications/components/InterestRating';
import { StatusBadge } from '@/pages/applications/components/StatusBadge';
import { formatApplicationDate, type ApplicationRecord } from '@/pages/applications/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface KanbanCardProps {
  application: ApplicationRecord;
  userId: string;
}

function KanbanCard({ application, userId }: KanbanCardProps) {
  return (
    <Card
      size="sm"
      className="gap-3 border-border/70 bg-card shadow-xs transition-colors motion-reduce:transition-none hover:border-border"
    >
      <CardHeader className="gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="truncate font-heading text-small font-semibold tracking-tight">
              <Link
                className="transition-colors motion-reduce:transition-none hover:text-primary"
                to="/applications/$id"
                params={{ id: application.id }}
              >
                {application.company}
              </Link>
            </CardTitle>
            <Link
              className="mt-1 line-clamp-2 text-caption leading-relaxed text-muted-foreground transition-colors motion-reduce:transition-none hover:text-primary"
              to="/applications/$id"
              params={{ id: application.id }}
            >
              {application.position}
            </Link>
          </div>
          <ApplicationActionMenu application={application} context="kanban" userId={userId} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={application.status} />
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
