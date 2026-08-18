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
      <CardContent>
        <dl className="space-y-4">
          <DetailRow label="Status" value={<StatusBadge status={application.status} />} />
          <Separator />
          <DetailRow label="Interest" value={<InterestRating value={application.interestRating} />} />
          <Separator />
          <DetailRow label="Added" value={formatApplicationDate(application.applicationDate)} />
          <Separator />
          <DetailRow label="Source" value={application.source} />
          {application.employmentType && (
            <DetailRowWithSeparator label="Employment" value={application.employmentType} />
          )}
          {application.workArrangement && (
            <DetailRowWithSeparator
              label="Work arrangement"
              value={formatWorkArrangement(application.workArrangement)}
            />
          )}
          {application.hoursPerWeek && (
            <DetailRowWithSeparator label="Hours per week" value={application.hoursPerWeek} />
          )}
          {(application.salaryMin || application.salaryMax) && (
            <DetailRowWithSeparator label="Salary" value={formatSalary(application)} />
          )}
          {application.requisitionNumber && (
            <DetailRowWithSeparator label="Requisition" value={application.requisitionNumber} />
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

function formatSalary(application: ApplicationRecord) {
  const amount = [application.salaryMin, application.salaryMax].filter(Boolean).join(' – ');
  return [application.salaryCurrency, amount, application.salaryPeriod?.toLowerCase()].filter(Boolean).join(' ');
}

function formatWorkArrangement(value: string | null | undefined) {
  if (value === 'REMOTE') return 'Remote';
  if (value === 'HYBRID') return 'Hybrid';
  if (value === 'ONSITE') return 'On-site';
  return value ?? 'Not specified';
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-small text-muted-foreground">{label}</dt>
      <dd className="max-w-[62%] break-words text-right font-heading text-small font-medium">{value}</dd>
    </div>
  );
}

function DetailRowWithSeparator({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <Separator />
      <DetailRow label={label} value={value} />
    </>
  );
}
import type { ReactNode } from 'react';
