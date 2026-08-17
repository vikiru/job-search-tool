import { NotebookPen } from 'lucide-react';

function NotesEmptyState() {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-border px-4 py-6 text-center">
      <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <NotebookPen className="size-icon-sm" aria-hidden="true" />
      </div>
      <p className="mt-3 font-heading text-small font-medium">No notes yet</p>
      <p className="mt-1 max-w-sm text-caption leading-relaxed text-muted-foreground">
        Add reminders, interview prompts, or follow-ups as your application moves forward.
      </p>
    </div>
  );
}

export { NotesEmptyState };
