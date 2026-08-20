import { toast } from 'sonner';

import type { SelectApplicationNote } from '@/server/db/zod';

import { useApplicationNotes } from '@/features/application-data/useApplicationNotes';
import { AddNoteDialog } from '@/pages/applications/components/AddNoteDialog';
import { EditNoteDialog } from '@/pages/applications/components/EditNoteDialog';
import { NotesEmptyState } from '@/pages/applications/components/NotesEmptyState';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
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

  async function editNote(id: string, content: string) {
    const result = await noteMutations.update.mutateAsync({ id, content });
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success('Note updated.');
    return true;
  }

  async function removeNote(id: string) {
    const result = await noteMutations.remove.mutateAsync(id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Note deleted.');
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
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-small leading-relaxed whitespace-pre-wrap">{note.content}</p>
                    <div className="flex shrink-0 items-center gap-1">
                      <EditNoteDialog
                        content={note.content}
                        isSubmitting={noteMutations.update.isPending}
                        onSubmit={(content) => editNote(note.id, content)}
                      />
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Delete note"
                          >
                            <Trash2 aria-hidden="true" />
                          </Button>
                        }
                        heading="Delete this note?"
                        body="This note will be permanently removed from the application."
                        actionLabel="Delete note"
                        onConfirm={() => removeNote(note.id)}
                      />
                    </div>
                  </div>
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
import { Trash2 } from 'lucide-react';
