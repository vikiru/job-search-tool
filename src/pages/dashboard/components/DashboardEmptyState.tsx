import { Link } from '@tanstack/react-router';
import { BriefcaseBusiness } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';

export function DashboardEmptyState() {
  return (
    <Empty className="min-h-72 rounded-xl border border-dashed border-border px-6 py-12 sm:min-h-80">
      <EmptyMedia
        className="size-12 rounded-2xl bg-primary/10 text-primary [&_svg:not([class*='size-'])]:size-icon-lg"
        variant="icon"
      >
        <BriefcaseBusiness className="size-icon-lg" aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle className="text-h3">Start with one application</EmptyTitle>
        <EmptyDescription>Add a role to see your pipeline, activity, and next steps take shape here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button className="font-heading" render={<Link to="/applications" />}>
          Add an application
        </Button>
      </EmptyContent>
    </Empty>
  );
}
