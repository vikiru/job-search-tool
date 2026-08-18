/* oxlint-disable react/react-compiler -- form state is synchronized with the selected link being edited. */

import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

interface ApplicationLinkFormValues {
  id?: string;
  label: string;
  href: string;
}

interface ApplicationLinkDialogProps {
  initialValues: ApplicationLinkFormValues | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ApplicationLinkFormValues) => Promise<boolean>;
}

export function ApplicationLinkDialog({
  initialValues,
  isOpen,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: ApplicationLinkDialogProps) {
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');

  useEffect(() => {
    setLabel(initialValues?.label ?? '');
    setHref(initialValues?.href ?? '');
  }, [initialValues]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await onSubmit({ id: initialValues?.id, label: label.trim(), href: href.trim() });
    if (saved) onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-5 sm:p-6">
        <DialogHeader className="gap-4 pr-8">
          <DialogTitle className="text-h4 font-semibold tracking-tight">
            {initialValues ? 'Edit link' : 'Add a link'}
          </DialogTitle>
          <DialogDescription className="max-w-md text-small leading-relaxed">
            Save a job posting, portfolio, interview notes, or another reference for this application.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-7" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label
              className="block font-heading text-small leading-normal font-medium"
              htmlFor="application-link-label"
            >
              Link name
            </label>
            <Input
              id="application-link-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Portfolio or interview notes"
              required
            />
          </div>
          <div className="space-y-4">
            <label className="block font-heading text-small leading-normal font-medium" htmlFor="application-link-url">
              URL
            </label>
            <Input
              id="application-link-url"
              type="url"
              value={href}
              onChange={(event) => setHref(event.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
          <DialogFooter className="-mx-5 -mb-5 gap-3 border-border/60 pt-6 sm:-mx-6 sm:-mb-6 sm:gap-2">
            <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {initialValues ? 'Save link' : 'Add link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type { ApplicationLinkFormValues };
