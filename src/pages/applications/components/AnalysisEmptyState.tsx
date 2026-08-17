import { ScanSearch } from 'lucide-react';

function AnalysisEmptyState() {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-border px-5 py-8 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ScanSearch className="size-icon-base" aria-hidden="true" />
      </div>
      <p className="mt-3 font-heading text-small font-semibold tracking-tight">No fit analysis yet</p>
      <p className="mt-1 max-w-md text-small leading-relaxed text-muted-foreground">
        Compare this job description with your resume to surface matches, gaps, and useful interview talking points.
      </p>
    </div>
  );
}

export { AnalysisEmptyState };
