import { Sparkles } from 'lucide-react';

import { AnalysisEmptyState } from '@/pages/applications/components/AnalysisEmptyState';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import type { SelectApplicationAnalysis } from '@/server/db/zod';

export function FitAnalysisSection({ analysis }: { analysis: SelectApplicationAnalysis | null }) {
  const hasAnalysis = Boolean(analysis);
  const score = analysis?.matchScore ?? 0;
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
        {hasAnalysis && <span className="font-mono text-h3 font-semibold tabular-nums text-primary">{score}%</span>}
      </CardHeader>
      <CardContent className="space-y-5">
        {hasAnalysis ? (
          <>
            <Progress
              value={score}
              aria-label={`Resume fit score: ${score} percent`}
              className="gap-0 motion-reduce:transition-none [&_[data-slot=progress-indicator]]:bg-primary [&_[data-slot=progress-track]]:h-2"
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
