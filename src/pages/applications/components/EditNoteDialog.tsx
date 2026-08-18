import { Pencil } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';

interface EditNoteDialogProps {
  content: string;
  isSubmitting?: boolean;
  onSubmit: (content: string) => Promise<boolean>;
}

export function EditNoteDialog({ content: initialContent, isSubmitting = false, onSubmit }: EditNoteDialogProps) {
  const [content, setContent] = useState(initialContent);
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setContent(initialContent);
    setOpen(nextOpen);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await onSubmit(content)) setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Edit note">
            <Pencil aria-hidden="true" />
          </Button>
        }
      />
      <DialogContent className="max-w-xl gap-7 p-5 sm:max-w-2xl sm:p-7">
        <DialogHeader className="gap-3 pr-8">
          <DialogTitle className="font-heading text-h3 leading-tight font-semibold tracking-tight">
            Edit note
          </DialogTitle>
          <DialogDescription className="max-w-prose text-small leading-relaxed text-pretty">
            Keep this reminder current as your application moves forward.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label htmlFor="edit-application-note" className="block font-heading text-small font-medium tracking-tight">
              Note
            </label>
            <Textarea
              id="edit-application-note"
              className="min-h-36 resize-y text-small leading-relaxed sm:min-h-40"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>
          <DialogFooter className="mx-0 mb-0 gap-2 rounded-none border-t border-border/60 bg-transparent p-0 pt-5 sm:justify-end">
            <DialogClose render={<Button variant="ghost" className="font-heading" />}>Cancel</DialogClose>
            <Button type="submit" className="font-heading" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
