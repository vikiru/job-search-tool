import { AddNoteDialog } from '@/pages/applications/components/AddNoteDialog';
import { NotesEmptyState } from '@/pages/applications/components/NotesEmptyState';
import { useApplicationNotes } from '@/features/applications/hooks/useApplicationMutations';
import type { SelectApplicationNote } from '@/server/db/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

export function NotesSection({
  applicationId,
  userId,
  notes,
}: {
  applicationId: string;
  userId: string;
  notes: SelectApplicationNote[];
}) {
  const noteMutations = useApplicationNotes(userId, applicationId);

  async function addNote(content: string) {
    const result = await noteMutations.add.mutateAsync(content);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Note saved.');
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="font-heading text-h4 font-semibold">Notes</CardTitle>
          <p className="mt-1 text-small leading-relaxed text-muted-foreground">
            Keep interview prompts, follow-ups, and decisions in one place.
          </p>
        </div>
        <AddNoteDialog onSubmit={addNote} isSubmitting={noteMutations.add.isPending} />
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-80 pr-2">
          {notes.length === 0 ? (
            <NotesEmptyState />
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <article key={note.id} className="rounded-lg border border-border/70 p-4">
                  <p className="whitespace-pre-wrap text-small leading-relaxed">{note.content}</p>
                  <time className="mt-3 block font-mono text-caption text-muted-foreground">
                    {new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(
                      note.createdAt,
                    )}
                  </time>
                </article>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
