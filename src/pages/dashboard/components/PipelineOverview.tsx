import { ArrowUpRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { DashboardStatusCount } from '@/server/db/queries/dashboard';

const pipeline = [
  { label: 'Saved', status: 'SAVED', className: 'bg-primary/20' },
  { label: 'Applied', status: 'APPLIED', className: 'bg-primary/40' },
  { label: 'Screening', status: 'SCREENING', className: 'bg-primary/60' },
  { label: 'Interview', status: 'INTERVIEW', className: 'bg-primary' },
  { label: 'Offer', status: 'OFFER', className: 'bg-success/80' },
  { label: 'Rejected', status: 'REJECTED', className: 'bg-destructive/60' },
  { label: 'Withdrawn', status: 'WITHDRAWN', className: 'bg-muted-foreground/40' },
  { label: 'Ghosted', status: 'GHOSTED', className: 'bg-muted-foreground/60' },
] as const;

function PipelineOverview({ statusCounts }: { statusCounts: DashboardStatusCount[] }) {
  const counts = new Map(statusCounts.map(({ status, count }) => [status, count]));
  const total = statusCounts.reduce((sum, item) => sum + item.count, 0);
  const beyondSaved = total - (counts.get('SAVED') ?? 0);
  const beyondSavedPercentage = total ? Math.round((beyondSaved / total) * 100) : 0;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <div>
          <CardTitle className="font-heading text-h4 font-semibold">Pipeline overview</CardTitle>
          <p className="mt-1 max-w-prose text-small leading-relaxed text-pretty text-muted-foreground">
            Where your applications are sitting right now.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        {pipeline.map((stage) => {
          const count = counts.get(stage.status) ?? 0;
          const width = total ? `${(count / total) * 100}%` : '0%';

          return (
            <div key={stage.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)_2rem] items-center gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate font-heading text-small text-muted-foreground">{stage.label}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className={`h-full min-w-0 rounded-full ${stage.className}`} style={{ width }} />
              </div>
              <span className="text-right font-mono text-caption tabular-nums text-foreground/80">{count}</span>
            </div>
          );
        })}
        <div className="flex items-center justify-between border-t border-border/70 pt-4">
          <p className="font-heading text-small text-muted-foreground">Applications beyond saved</p>
          <p className="flex items-center gap-1 font-heading text-small font-semibold tabular-nums text-foreground">
            {beyondSavedPercentage}%
            <ArrowUpRight className="size-icon-xs text-primary" aria-hidden="true" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export { PipelineOverview };
