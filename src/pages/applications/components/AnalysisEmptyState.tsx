import { ScanSearch } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';

function AnalysisEmptyState() {
  return (
    <Empty className="min-h-44 rounded-lg border border-dashed border-border px-5 py-8">
      <EmptyMedia className="rounded-full bg-primary/10 text-primary" variant="icon">
        <ScanSearch className="size-icon-sm" aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>No fit analysis yet</EmptyTitle>
        <EmptyDescription>
          Compare this job description with your resume to surface matches, gaps, and useful interview talking points.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export { AnalysisEmptyState };
