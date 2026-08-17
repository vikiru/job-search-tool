import { AddNoteDialog } from '@/pages/applications/components/AddNoteDialog';
import { NotesEmptyState } from '@/pages/applications/components/NotesEmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

export function NotesSection() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="font-heading text-h4 font-semibold">Notes</CardTitle>
          <p className="mt-1 text-small leading-relaxed text-muted-foreground">
            Keep interview prompts, follow-ups, and decisions in one place.
          </p>
        </div>
        <AddNoteDialog />
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-80 pr-2">
          <NotesEmptyState />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
