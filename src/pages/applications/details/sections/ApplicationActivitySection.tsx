import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { SelectApplicationActivity } from '@/server/db/zod';
import { formatStatus } from '@/pages/applications/data';

export function ApplicationActivitySection({ activity }: { activity: SelectApplicationActivity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-h4 font-semibold">Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activity.length === 0 && <p className="text-small text-muted-foreground">No activity yet.</p>}
        {activity.map((item, index) => (
          <div key={item.id} className="relative flex gap-3">
            <div className="relative flex w-3 shrink-0 justify-center">
              <span className="mt-1.5 size-2 rounded-full bg-primary" />
              {index < activity.length - 1 && <span className="absolute top-4 h-full w-px bg-border" />}
            </div>
            <div className="min-w-0">
              <p className="font-heading text-small font-medium">{getActivityLabel(item)}</p>
              <time className="mt-1 block font-mono text-caption text-muted-foreground">
                {new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(
                  item.createdAt,
                )}
              </time>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function getActivityLabel(item: SelectApplicationActivity) {
  if (item.eventType === 'APPLICATION_CREATED') return 'Application added';
  return item.nextStatus ? `Status changed to ${formatStatus(item.nextStatus)}` : 'Status changed';
}
