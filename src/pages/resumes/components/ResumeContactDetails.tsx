import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

import { EditResumeContactDialog } from '@/pages/resumes/components/EditResumeContactDialog';
import { ResumePublicLinks, type PublicLink } from '@/pages/resumes/components/ResumePublicLinks';
import { Button } from '@/shared/components/ui/button';

const initialPublicLinks: PublicLink[] = [
  { label: 'LinkedIn', href: 'linkedin.com/in/johndoe' },
  { label: 'Portfolio', href: 'johndoe.design' },
];

export function ResumeContactDetails() {
  const [showDetails, setShowDetails] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [publicLinks, setPublicLinks] = useState(initialPublicLinks);

  return (
    <section
      className="rounded-xl border border-border/70 bg-muted/30 p-5 sm:p-6"
      aria-labelledby="contact-details-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <LockKeyhole className="size-icon-sm" aria-hidden="true" />
            <span className="font-heading text-caption font-semibold tracking-[0.08em] uppercase">Private details</span>
          </div>
          <h2 id="contact-details-heading" className="mt-3 font-heading text-h4 font-semibold tracking-tight">
            Contact information
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
          <Button variant="ghost" size="sm" onClick={() => setShowDetails((visible) => !visible)}>
            {showDetails ? (
              <EyeOff data-icon="inline-start" aria-hidden="true" />
            ) : (
              <Eye data-icon="inline-start" aria-hidden="true" />
            )}
            {showDetails ? 'Hide details' : 'Show details'}
          </Button>
          <EditResumeContactDialog
            links={publicLinks}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSaveLinks={setPublicLinks}
          />
        </div>
      </div>

      <p className="mt-3 max-w-prose text-small leading-relaxed text-muted-foreground">
        Your contact details are hidden until you choose to view or update them.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-3">
          <p className="font-heading text-caption font-medium text-muted-foreground">Email</p>
          <p className="mt-1 truncate text-small font-medium">
            {showDetails ? 'john.doe@example.com' : 'j••••@example.com'}
          </p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-3">
          <p className="font-heading text-caption font-medium text-muted-foreground">Phone</p>
          <p className="mt-1 text-small font-medium">{showDetails ? '(416) 555-0142' : '(•••) •••-0142'}</p>
        </div>
      </div>

      <ResumePublicLinks links={publicLinks} />
    </section>
  );
}
