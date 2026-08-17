import { BriefcaseBusiness } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

type PreviewStatus = 'SAVED' | 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN' | 'GHOSTED';

const previewApplications = [
  {
    company: 'Northstar Labs',
    role: 'Product Designer',
    status: 'INTERVIEW' as PreviewStatus,
    tone: 'default' as const,
  },
  { company: 'Arc & Field', role: 'UX Researcher', status: 'APPLIED' as PreviewStatus, tone: 'secondary' as const },
  { company: 'Monument Studio', role: 'Design Lead', status: 'SCREENING' as PreviewStatus, tone: 'outline' as const },
];

function formatStatus(status: PreviewStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function HeroPreview() {
  return (
    <Card className="relative border-primary/15 bg-card/90 shadow-2xl shadow-primary/10 ring-primary/10">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-primary/50 to-transparent" />
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="font-heading text-xl">Your pipeline, at a glance.</CardTitle>
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {previewApplications.map((application) => (
          <div
            key={application.company}
            className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/70 p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{application.role}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{application.company}</p>
            </div>
            <Badge variant={application.tone}>{formatStatus(application.status)}</Badge>
          </div>
        ))}
        <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
          Example applications shown in a shared table and Kanban workflow.
        </div>
      </CardContent>
    </Card>
  );
}

export { HeroPreview };
