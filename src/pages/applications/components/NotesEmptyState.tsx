import { NotebookPen } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty';

function NotesEmptyState() {
  return (
    <Empty className="min-h-28 rounded-lg border border-dashed border-border px-4 py-6">
      <EmptyMedia
        className="size-9 rounded-full bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-icon-sm"
        variant="icon"
      >
        <NotebookPen className="size-icon-sm" aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>No notes yet</EmptyTitle>
        <EmptyDescription className="text-caption">
          Add reminders, interview prompts, or follow-ups as your application moves forward.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export { NotesEmptyState };
