import { Plus } from 'lucide-react';

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

function AddNoteDialog() {
  return (
    <Dialog>
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
        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <div className="space-y-3">
            <label htmlFor="application-note" className="block font-heading text-small font-medium tracking-tight">
              Note
            </label>
            <Textarea
              id="application-note"
              className="min-h-36 resize-y text-small leading-relaxed sm:min-h-40"
              placeholder="What do you want to remember?"
              required
            />
          </div>
          <DialogFooter className="mx-0 mb-0 gap-2 rounded-none border-t border-border/60 bg-transparent p-0 pt-5 sm:justify-end">
            <DialogClose render={<Button variant="ghost" className="font-heading" />}>Cancel</DialogClose>
            <Button type="submit" className="font-heading">
              Save note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AddNoteDialog };
