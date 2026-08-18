import { Badge } from '@/shared/components/ui/badge';

import { formatStatus, type ApplicationStatus } from '@/pages/applications/application-model';

const statusClassNames: Record<ApplicationStatus, string> = {
  SAVED: 'border-primary/20 bg-primary/10 text-primary',
  APPLIED: 'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  SCREENING: 'border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  INTERVIEW: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  OFFER: 'border-success/25 bg-success/10 text-success',
  REJECTED: 'border-destructive/20 bg-destructive/10 text-destructive',
  WITHDRAWN: 'border-muted-foreground/20 bg-muted text-muted-foreground',
  GHOSTED: 'border-muted-foreground/20 bg-muted text-muted-foreground',
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge className={`font-heading text-caption ${statusClassNames[status]}`} variant="outline">
      {formatStatus(status)}
    </Badge>
  );
}

export { StatusBadge };
