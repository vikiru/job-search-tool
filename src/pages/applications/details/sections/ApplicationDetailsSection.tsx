import { InterestRating } from '@/pages/applications/components/InterestRating';
import { StatusBadge } from '@/pages/applications/components/StatusBadge';
import { formatApplicationDate, type ApplicationRecord } from '@/pages/applications/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';

export function ApplicationDetailsSection({ application }: { application: ApplicationRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-h4 font-semibold">Application details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailRow label="Status" value={<StatusBadge status={application.status} />} />
        <Separator />
        <DetailRow label="Interest" value={<InterestRating value={application.interestRating} />} />
        <Separator />
        <DetailRow label="Added" value={formatApplicationDate(application.applicationDate)} />
        <Separator />
        <DetailRow label="Source" value={application.source} />
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-small text-muted-foreground">{label}</dt>
      <dd className="text-right font-heading text-small font-medium">{value}</dd>
    </div>
  );
}
import type { ReactNode } from 'react';
