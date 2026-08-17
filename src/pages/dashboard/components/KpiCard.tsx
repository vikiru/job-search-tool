import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/card';

interface KpiCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: 'default' | 'muted' | 'positive';
}

function KpiCard({ label, value, detail, icon: Icon, tone = 'default' }: KpiCardProps) {
  return (
    <Card size="sm" className="min-w-0">
      <CardContent className="flex min-h-32 flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-3">
          <p className="font-heading text-small leading-normal font-medium text-muted-foreground">{label}</p>
          <div
            className={
              tone === 'positive'
                ? 'flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary'
                : 'flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground'
            }
          >
            <Icon className="size-icon-sm" aria-hidden="true" />
          </div>
        </div>
        <div>
          <p className="font-heading text-h3 font-semibold leading-none tracking-tight tabular-nums">{value}</p>
          <p className="mt-2 text-small leading-normal text-muted-foreground">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export { KpiCard };
