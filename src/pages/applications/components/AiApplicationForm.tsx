import { Link as LinkIcon, Sparkles } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { DialogClose, DialogFooter } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { getFormString } from '@/shared/lib/utils';

interface AiApplicationFormProps {
  isSubmitting?: boolean;
  onSubmit: (values: { applicationUrl: string; jobDescriptionMd: string }) => void | Promise<void>;
}

function AiApplicationForm({ isSubmitting = false, onSubmit }: AiApplicationFormProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onSubmit({
      applicationUrl: getFormString(formData, 'applicationUrl'),
      jobDescriptionMd: getFormString(formData, 'jobDescriptionMd'),
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="application-url" className="block font-heading text-small font-medium tracking-tight">
          Job posting URL <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <div className="relative">
          <LinkIcon
            className="pointer-events-none absolute top-1/2 left-3 size-icon-sm -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="application-url"
            name="applicationUrl"
            className="h-10 pl-9"
            type="url"
            placeholder="https://company.com/role"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="job-description" className="font-heading text-small font-medium tracking-tight">
            Job description
          </label>
          <span className="text-caption text-muted-foreground">Required</span>
        </div>
        <Textarea
          id="job-description"
          name="jobDescriptionMd"
          className="min-h-48 resize-y text-small leading-relaxed sm:min-h-56"
          placeholder="Paste the full job description here..."
          required
        />
        <p className="text-caption leading-relaxed text-muted-foreground">
          We’ll keep the original posting attached to the application for reference.
        </p>
      </div>
      <DialogFooter className="mx-0 mb-0 gap-2 rounded-none border-t border-border/60 bg-transparent p-0 pt-5 sm:justify-end">
        <DialogClose render={<Button variant="ghost" className="font-heading" />}>Cancel</DialogClose>
        <Button type="submit" className="font-heading" disabled={isSubmitting}>
          <Sparkles data-icon="inline-start" aria-hidden="true" />
          {isSubmitting ? 'Analyzing job description…' : 'Analyze job description'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export { AiApplicationForm };
