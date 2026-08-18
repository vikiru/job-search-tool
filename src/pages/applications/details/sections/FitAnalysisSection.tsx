import { CheckCircle2, CircleAlert, Sparkles } from 'lucide-react';

import type { SelectApplicationAnalysis } from '@/server/db/zod';

import { AnalysisEmptyState } from '@/pages/applications/components/AnalysisEmptyState';
import { AnalyzeMatchDialog } from '@/pages/applications/details/components/AnalyzeMatchDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';

interface FitAnalysisSectionProps {
  analysis: SelectApplicationAnalysis | null;
  applicationId: string;
  userId: string;
}

export function FitAnalysisSection({ analysis, applicationId, userId }: FitAnalysisSectionProps) {
  const hasMatchAnalysis = analysis?.matchScore !== null && analysis?.matchScore !== undefined;
  const score = analysis?.matchScore ?? 0;
  return (
    <Card className="min-w-0">
      <CardHeader className="flex-col items-start justify-between gap-5 sm:flex-row">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 font-heading text-h4 font-semibold">
            <Sparkles className="size-icon-sm text-primary" aria-hidden="true" />
            Fit analysis
          </CardTitle>
          <p className="text-small leading-relaxed text-muted-foreground">
            A quick comparison between this role and your resume.
          </p>
        </div>
        {!hasMatchAnalysis && <AnalyzeMatchDialog applicationId={applicationId} userId={userId} />}
        {hasMatchAnalysis && (
          <div className="shrink-0 text-right">
            <p className="font-mono text-caption tracking-[0.08em] text-muted-foreground uppercase">Match score</p>
            <p className="font-mono text-h3 leading-none font-semibold text-primary tabular-nums">{score}%</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="min-w-0 space-y-5 sm:p-7">
        {hasMatchAnalysis && analysis ? (
          <>
            <Progress
              value={score}
              aria-label={`Resume fit score: ${score} percent`}
              className="gap-0 motion-reduce:transition-none [&_[data-slot=progress-indicator]]:bg-primary [&_[data-slot=progress-track]]:h-2"
            />
            <AnalysisSummary analysis={analysis} />
          </>
        ) : (
          <AnalysisEmptyState />
        )}
      </CardContent>
    </Card>
  );
}

function AnalysisSummary({ analysis }: { analysis: SelectApplicationAnalysis }) {
  return (
    <div className="min-w-0 space-y-8">
      {analysis.tldr && (
        <section className="space-y-3 rounded-lg bg-muted/40 p-4 sm:p-5">
          <h3 className="font-heading text-h4 leading-tight font-semibold tracking-tight">TL;DR</h3>
          <p className="max-w-readable text-analysis wrap-break-word text-foreground/80">{analysis.tldr}</p>
        </section>
      )}
      <div className="space-y-6">
        <AnalysisTags title="Strong matches" values={analysis.matchedRequirements ?? []} />
        <AnalysisTags title="Missing requirements" values={analysis.missingRequirements ?? []} tone="warning" />
      </div>
      <AnalysisBlock title="Strengths" items={analysis.strengths ?? []} />
      <AnalysisBlock title="Gaps to prepare for" items={analysis.gaps ?? []} tone="warning" />
      <AnalysisBlock title="Recommendations" items={analysis.recommendations ?? []} />
      {analysis.observations && <AnalysisBlock title="Recruiter observations" items={[analysis.observations]} />}
    </div>
  );
}

function AnalysisTags({
  title,
  values,
  tone = 'default',
}: {
  title: string;
  values: string[];
  tone?: 'default' | 'warning';
}) {
  return (
    <section className="min-w-0 space-y-4 border-t border-border/60 pt-6 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2.5">
        {tone === 'warning' ? (
          <CircleAlert className="size-icon-sm text-destructive" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="size-icon-sm text-success" aria-hidden="true" />
        )}
        <h3 className="font-heading text-h4 leading-tight font-semibold tracking-tight">{title}</h3>
      </div>
      {values.length > 0 ? (
        <ul className="max-w-readable space-y-3.5 pl-1 text-analysis text-foreground/80">
          {values.map((value, index) => (
            <li key={`${value}-${index}`} className="flex min-w-0 gap-3">
              <span
                className={`mt-[0.72em] size-1.5 shrink-0 rounded-full ${tone === 'warning' ? 'bg-destructive/70' : 'bg-success/70'}`}
                aria-hidden="true"
              />
              <span className="min-w-0 wrap-break-word">{value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-small leading-relaxed text-muted-foreground">None identified.</p>
      )}
    </section>
  );
}

function AnalysisBlock({
  title,
  items,
  tone = 'default',
}: {
  title: string;
  items: string[];
  tone?: 'default' | 'warning';
}) {
  return (
    <section className="min-w-0 space-y-3 border-t border-border/60 pt-6 first:border-t-0 first:pt-0">
      <h3
        className={`font-heading text-h4 leading-tight font-semibold tracking-tight ${tone === 'warning' ? 'text-destructive' : ''}`}
      >
        {title}
      </h3>
      {items.length > 0 ? (
        <ul
          className={`max-w-readable list-disc space-y-3 pl-6 text-analysis ${tone === 'warning' ? 'marker:text-destructive' : 'marker:text-primary'} text-foreground/80`}
        >
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="pl-1 wrap-break-word">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-small leading-relaxed text-muted-foreground">None identified.</p>
      )}
    </section>
  );
}
