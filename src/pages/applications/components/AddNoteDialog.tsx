import { Plus } from 'lucide-react';
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

interface AddNoteDialogProps {
  isSubmitting?: boolean;
  onSubmit: (content: string) => Promise<void>;
}

function AddNoteDialog({ isSubmitting = false, onSubmit }: AddNoteDialogProps) {
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(content);
    setContent('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline" className="shrink-0 font-heading">
            <Plus data-icon="inline-start" aria-hidden="true" />
            Add note
          </Button>
        }
      />
      <DialogContent className="max-w-xl gap-7 p-5 sm:max-w-2xl sm:p-7">
        <DialogHeader className="gap-3 pr-8">
          <DialogTitle className="font-heading text-h3 font-semibold leading-tight tracking-tight">
            Add a note
          </DialogTitle>
          <DialogDescription className="max-w-prose text-small leading-relaxed text-pretty">
            Capture a thought, follow-up, or interview prompt while it’s fresh.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label htmlFor="application-note" className="block font-heading text-small font-medium tracking-tight">
              Note
            </label>
            <Textarea
              id="application-note"
              className="min-h-36 resize-y text-small leading-relaxed sm:min-h-40"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="What do you want to remember?"
              required
            />
          </div>
          <DialogFooter className="mx-0 mb-0 gap-2 rounded-none border-t border-border/60 bg-transparent p-0 pt-5 sm:justify-end">
            <DialogClose render={<Button variant="ghost" className="font-heading" />}>Cancel</DialogClose>
            <Button type="submit" className="font-heading" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? 'Saving…' : 'Save note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AddNoteDialog };
