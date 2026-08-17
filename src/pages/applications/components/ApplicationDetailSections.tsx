import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

import { AddNoteDialog } from '@/pages/applications/components/AddNoteDialog';
import { AnalysisEmptyState } from '@/pages/applications/components/AnalysisEmptyState';
import { ApplicationLinksCard } from '@/pages/applications/components/ApplicationLinksCard';
import { InterestRating } from '@/pages/applications/components/InterestRating';
import { NotesEmptyState } from '@/pages/applications/components/NotesEmptyState';
import { StatusBadge } from '@/pages/applications/components/StatusBadge';
import { formatApplicationDate, getApplicationJobDescription, type ApplicationRecord } from '@/pages/applications/data';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';

const activity = [
  { label: 'Application added', date: 'Aug 2, 2026' },
  { label: 'Status changed to Applied', date: 'Aug 3, 2026' },
];

function JobDescriptionCard({ application }: { application: ApplicationRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-h4 font-semibold">Job description</CardTitle>
        <p className="text-small leading-relaxed text-muted-foreground">
          Keep the role context close while you prepare your application and next steps.
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-5 text-small leading-relaxed text-muted-foreground">
        {getApplicationJobDescription(application)
          .split('\n\n')
          .map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {application.technologies.map((technology) => (
            <Badge key={technology} variant="secondary" className="font-heading text-caption">
              {technology}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FitAnalysisCard({ hasAnalysis = false }: { hasAnalysis?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 font-heading text-h4 font-semibold">
            <Sparkles className="size-icon-base text-primary" aria-hidden="true" />
            Fit analysis
          </CardTitle>
          <p className="text-small leading-relaxed text-muted-foreground">
            A quick comparison between this role and your resume.
          </p>
        </div>
        {!hasAnalysis && (
          <Button className="shrink-0 font-heading" size="sm">
            <Sparkles data-icon="inline-start" aria-hidden="true" />
            Analyze match
          </Button>
        )}
        {hasAnalysis && <span className="font-mono text-h3 font-semibold tabular-nums text-primary">78%</span>}
      </CardHeader>
      <CardContent className="space-y-5">
        {hasAnalysis ? (
          <>
            <Progress
              value={78}
              aria-label="Resume fit score: 78 percent"
              className="gap-0 [&_[data-slot=progress-indicator]]:bg-primary [&_[data-slot=progress-track]]:h-2"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <AnalysisPoint
                title="Strong matches"
                description="Product design, prototyping, and design systems experience align well with the role."
              />
              <AnalysisPoint
                title="Worth preparing"
                description="Bring examples of cross-functional delivery and research-led decisions."
              />
            </div>
          </>
        ) : (
          <AnalysisEmptyState />
        )}
      </CardContent>
    </Card>
  );
}

function AnalysisPoint({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg bg-muted/60 p-4">
      <p className="font-heading text-small font-semibold">{title}</p>
      <p className="mt-1 text-small leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function NotesCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="font-heading text-h4 font-semibold">Notes</CardTitle>
          <p className="mt-1 text-small leading-relaxed text-muted-foreground">
            Keep interview prompts, follow-ups, and decisions in one place.
          </p>
        </div>
        <AddNoteDialog />
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-80 pr-2">
          <NotesEmptyState />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ApplicationDetailsCard({ application }: { application: ApplicationRecord }) {
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

function ApplicationActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-h4 font-semibold">Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activity.map((item, index) => (
          <div key={item.label} className="relative flex gap-3">
            <div className="relative flex w-3 shrink-0 justify-center">
              <span className="mt-1.5 size-2 rounded-full bg-primary" />
              {index < activity.length - 1 && <span className="absolute top-4 h-full w-px bg-border" />}
            </div>
            <div className="min-w-0">
              <p className="font-heading text-small font-medium">{item.label}</p>
              <time className="mt-1 block font-mono text-caption text-muted-foreground">{item.date}</time>
            </div>
          </div>
        ))}
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

export {
  ApplicationActivityCard,
  ApplicationDetailsCard,
  ApplicationLinksCard,
  FitAnalysisCard,
  JobDescriptionCard,
  NotesCard,
};
