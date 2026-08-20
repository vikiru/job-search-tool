import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useState } from 'react';

import type { UserContactData, UserContactUpdate } from '@/entities/user/schemas';

import { EditContactDialog } from '@/pages/resumes/components/EditContactDialog';
import { ResumePublicLinks } from '@/pages/resumes/components/ResumePublicLinks';
import { Button } from '@/shared/components/ui/button';

interface ResumeContactDetailsProps {
  contact: UserContactData;
  isSaving: boolean;
  onSaveContact: (contact: UserContactUpdate) => Promise<boolean>;
}

export function ResumeContactDetails({ contact, isSaving, onSaveContact }: ResumeContactDetailsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={showDetails}
            onClick={() => setShowDetails((visible) => !visible)}
          >
            {showDetails ? (
              <EyeOff data-icon="inline-start" aria-hidden="true" />
            ) : (
              <Eye data-icon="inline-start" aria-hidden="true" />
            )}
            {showDetails ? 'Hide details' : 'Show details'}
          </Button>
          <EditContactDialog
            contact={contact}
            isSaving={isSaving}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSaveContact={onSaveContact}
          />
        </div>
      </div>

      <p className="mt-3 max-w-prose text-small leading-relaxed text-muted-foreground">
        Your contact details are hidden until you choose to view or update them.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/70 bg-background/70 p-3">
          <p className="font-heading text-caption font-medium text-muted-foreground">Email</p>
          <p className="mt-1 truncate text-small font-medium">
            {showDetails ? (contact.email ?? 'Not added') : maskEmail(contact.email)}
          </p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background/70 p-3">
          <p className="font-heading text-caption font-medium text-muted-foreground">Phone</p>
          <p className="mt-1 text-small font-medium">
            {showDetails ? (contact.phoneNumber ?? 'Not added') : maskPhone(contact.phoneNumber)}
          </p>
        </div>
      </div>

      <ResumePublicLinks links={contact.links} />
    </section>
  );
}

function maskEmail(email: string | null): string {
  if (!email) return 'Not added';
  const [localPart, domain] = email.split('@');
  return `${localPart.slice(0, 1)}••••@${domain}`;
}

function maskPhone(phoneNumber: string | null): string {
  if (!phoneNumber) return 'Not added';
  return `•••• ${phoneNumber.slice(-4)}`;
}
