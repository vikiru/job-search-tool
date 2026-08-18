import { BriefcaseBusiness, SearchX } from 'lucide-react';

import { PasteJdDialog } from '@/pages/applications/components/PasteJdDialog';
import { Button } from '@/shared/components/ui/button';
import { CardContent } from '@/shared/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';

interface ApplicationsEmptyStateProps {
  isFiltered: boolean;
  onClear: () => void;
  userId: string;
}

function ApplicationsEmptyState({ isFiltered, onClear, userId }: ApplicationsEmptyStateProps) {
  if (!isFiltered) {
    return (
      <CardContent className="p-0">
        <Empty className="min-h-80 px-6 py-14 sm:min-h-96 sm:py-20">
          <EmptyMedia
            className="size-14 rounded-2xl bg-primary/10 text-primary [&_svg:not([class*='size-'])]:size-icon-xl"
            variant="icon"
          >
            <BriefcaseBusiness className="size-icon-xl" aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-h3">Start your job search here</EmptyTitle>
            <EmptyDescription className="text-p">
              Add a role to keep the job description, decisions, follow-ups, and next step together.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <PasteJdDialog userId={userId} />
            <p className="text-caption leading-relaxed text-muted-foreground">
              You can paste a job description or enter the details yourself.
            </p>
          </EmptyContent>
        </Empty>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-0">
      <Empty className="min-h-72 px-6 py-12">
        <EmptyMedia className="rounded-xl bg-muted text-muted-foreground" variant="icon">
          <SearchX className="size-icon-lg" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle className="text-h4">No matching applications</EmptyTitle>
          <EmptyDescription>Try a different search or clear the filters to see every application.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button className="font-heading" variant="outline" onClick={onClear}>
            Clear filters
          </Button>
        </EmptyContent>
      </Empty>
    </CardContent>
  );
}

export { ApplicationsEmptyState };
