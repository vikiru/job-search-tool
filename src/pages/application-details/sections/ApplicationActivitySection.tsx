import type { SelectApplicationActivity } from '@/server/db/zod';

import { formatStatus } from '@/entities/application/model';
import { ApplicationActivityEmptyState } from '@/pages/application-details/components/ApplicationActivityEmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

export function ApplicationActivitySection({ activity }: { activity: SelectApplicationActivity[] }) {
  const activityContent =
    activity.length === 0 ? (
      <ApplicationActivityEmptyState />
    ) : (
      <ol className="space-y-4" aria-label="Application activity">
        {activity.map((item, index) => (
          <li key={item.id} className="relative flex gap-3">
            <div className="relative flex w-3 shrink-0 justify-center">
              <span className="mt-1.5 size-2 rounded-full bg-primary" />
              {index < activity.length - 1 && <span className="absolute top-4 h-[calc(100%+1rem)] w-px bg-border" />}
            </div>
            <div className="min-w-0">
              <p className="font-heading text-small leading-snug font-medium">{getActivityLabel(item)}</p>
              <time className="mt-1 block font-mono text-caption text-muted-foreground">
                {new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(
                  item.createdAt,
                )}
              </time>
            </div>
          </li>
        ))}
      </ol>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-h4 font-semibold">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activity.length > 5 ? (
          <ScrollArea className="h-72 pr-2 sm:h-80" aria-label="Application activity history">
            {activityContent}
          </ScrollArea>
        ) : (
          activityContent
        )}
      </CardContent>
    </Card>
  );
}

function getActivityLabel(item: SelectApplicationActivity) {
  if (item.eventType === 'APPLICATION_CREATED') return 'Application added';
  return item.nextStatus ? `Status changed to ${formatStatus(item.nextStatus)}` : 'Status changed';
}
