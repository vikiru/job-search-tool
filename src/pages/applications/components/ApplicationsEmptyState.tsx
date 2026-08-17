import { BriefcaseBusiness, SearchX } from 'lucide-react';

import { PasteJdDialog } from '@/pages/applications/components/PasteJdDialog';
import { Button } from '@/shared/components/ui/button';
import { CardContent } from '@/shared/components/ui/card';

interface ApplicationsEmptyStateProps {
  isFiltered: boolean;
  onClear: () => void;
}

function ApplicationsEmptyState({ isFiltered, onClear }: ApplicationsEmptyStateProps) {
  if (!isFiltered) {
    return (
      <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-14 text-center sm:min-h-96 sm:py-20">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="size-icon-xl" aria-hidden="true" />
        </div>
        <h2 className="mt-6 font-heading text-h3 font-semibold leading-tight tracking-tight">
          Start your job search here
        </h2>
        <p className="mt-3 max-w-md text-p leading-relaxed text-pretty text-muted-foreground">
          Add a role to keep the job description, decisions, follow-ups, and next step together.
        </p>
        <div className="mt-7">
          <PasteJdDialog />
        </div>
        <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
          You can paste a job description or enter the details yourself.
        </p>
      </CardContent>
    );
  }

  return (
    <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <SearchX className="size-icon-lg" aria-hidden="true" />
      </div>
      <h2 className="mt-5 font-heading text-h4 font-semibold tracking-tight">No matching applications</h2>
      <p className="mt-2 max-w-sm text-small leading-relaxed text-pretty text-muted-foreground">
        Try a different search or clear the filters to see every application.
      </p>
      <Button className="mt-6 font-heading" variant="outline" onClick={onClear}>
        Clear filters
      </Button>
    </CardContent>
  );
}

export { ApplicationsEmptyState };
