import { ArrowUpRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const pipeline = [
  { label: 'Saved', count: 18, width: 'w-full', className: 'bg-primary/20' },
  { label: 'Applied', count: 9, width: 'w-1/2', className: 'bg-primary/40' },
  { label: 'Screening', count: 4, width: 'w-1/4', className: 'bg-primary/60' },
  { label: 'Interview', count: 3, width: 'w-[17%]', className: 'bg-primary' },
  { label: 'Offer', count: 1, width: 'w-[7%]', className: 'bg-success/80' },
  { label: 'Rejected', count: 5, width: 'w-[28%]', className: 'bg-destructive/60' },
  { label: 'Withdrawn', count: 2, width: 'w-[12%]', className: 'bg-muted-foreground/40' },
  { label: 'Ghosted', count: 3, width: 'w-[17%]', className: 'bg-muted-foreground/60' },
];

function PipelineOverview() {
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
        {pipeline.map((stage) => (
          <div key={stage.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)_2rem] items-center gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate font-heading text-small text-muted-foreground">{stage.label}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${stage.width} ${stage.className}`} />
            </div>
            <span className="text-right font-mono text-caption tabular-nums text-foreground/80">{stage.count}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-border/70 pt-4">
          <p className="font-heading text-small text-muted-foreground">Applications beyond saved</p>
          <p className="flex items-center gap-1 font-heading text-small font-semibold tabular-nums text-foreground">
            17%
            <ArrowUpRight className="size-icon-xs text-primary" aria-hidden="true" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export { PipelineOverview };
