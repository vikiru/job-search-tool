import { Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, CircleCheck, FileText } from 'lucide-react';

import type { RecentApplicationActivity } from '@/features/application-data/types';

import { RecentActivityEmptyState } from '@/pages/dashboard/components/RecentActivityEmptyState';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

function RecentActivity({ activity }: { activity: RecentApplicationActivity[] }) {
  return (
    <Card className="h-full min-w-0">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <CardTitle className="font-heading text-h4 font-semibold">Recent activity</CardTitle>
          <p className="mt-1 max-w-prose text-small leading-relaxed text-pretty text-muted-foreground">
            The latest changes in your search.
          </p>
        </div>
        <Button
          className="-mt-1 -mr-2 shrink-0 font-heading"
          variant="ghost"
          size="sm"
          render={<Link to="/applications" />}
        >
          View all
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-1 pt-2">
        {activity.length === 0 && <RecentActivityEmptyState />}
        {activity.map((item) => {
          const Icon = item.activity.eventType === 'APPLICATION_CREATED' ? FileText : CircleCheck;
          const event = getActivityLabel(item);

          return (
            <Link
              key={item.activity.id}
              className="flex items-start gap-3 rounded-lg px-1 py-3 transition-colors hover:bg-muted/60 motion-reduce:transition-none"
              to="/applications/$id"
              params={{ id: item.activity.applicationId }}
            >
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-icon-sm" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-small font-semibold text-foreground">{item.company}</p>
                <p className="mt-0.5 truncate text-small leading-normal text-muted-foreground">{item.position}</p>
                <p className="mt-1 font-heading text-caption text-muted-foreground">{event}</p>
              </div>
              <time className="shrink-0 pt-0.5 font-mono text-caption text-muted-foreground">
                {formatDistanceToNow(item.activity.createdAt, { addSuffix: true })}
              </time>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

function getActivityLabel({ activity }: RecentApplicationActivity) {
  if (activity.eventType === 'APPLICATION_CREATED') return 'Application added';
  return activity.nextStatus ? `Moved to ${activity.nextStatus.toLowerCase()}` : 'Status changed';
}

export { RecentActivity };
