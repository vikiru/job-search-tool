import type { FormEvent } from 'react';

import type { PublicLink } from '@/pages/resumes/components/ResumePublicLinks';
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
import { Input } from '@/shared/components/ui/input';

interface EditResumeContactDialogProps {
  links: PublicLink[];
  onOpenChange: (open: boolean) => void;
  onSaveLinks: (links: PublicLink[]) => void;
  open: boolean;
}

function EditResumeContactDialog({ links, onOpenChange, onSaveLinks, open }: EditResumeContactDialogProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSaveLinks(
      [
        { label: 'LinkedIn', href: String(formData.get('resume-contact-linkedin') ?? '').trim() },
        { label: 'GitHub', href: String(formData.get('resume-contact-github') ?? '').trim() },
        { label: 'Portfolio', href: String(formData.get('resume-contact-portfolio') ?? '').trim() },
      ].filter((link) => link.href),
    );
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Edit</DialogTrigger>
      <DialogContent className="max-w-2xl gap-7 p-5 sm:max-w-3xl sm:p-7">
        <DialogHeader className="gap-3 pr-8">
          <DialogTitle className="text-h4 font-semibold tracking-tight">Update contact information</DialogTitle>
          <DialogDescription className="max-w-xl text-small leading-relaxed">
            Email and phone stay private by default. Public links are always visible and can be updated here.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-7" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <ContactField id="resume-contact-email" label="Email address" type="email" value="john.doe@example.com" />
            <ContactField id="resume-contact-phone" label="Phone number" type="tel" value="(416) 555-0142" />
          </div>
          <fieldset className="border-t border-border/60 pt-6">
            <legend className="font-heading text-small font-semibold tracking-tight">Public links</legend>
            <div className="space-y-4">
              <p className="max-w-xl text-caption leading-relaxed text-muted-foreground">
                These links are visible on your resume profile.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <ContactField
                  id="resume-contact-linkedin"
                  label="LinkedIn"
                  value={links.find((link) => link.label === 'LinkedIn')?.href}
                />
                <ContactField
                  id="resume-contact-github"
                  label="GitHub"
                  value={links.find((link) => link.label === 'GitHub')?.href}
                />
                <ContactField
                  id="resume-contact-portfolio"
                  label="Portfolio"
                  value={links.find((link) => link.label === 'Portfolio')?.href}
                />
              </div>
            </div>
          </fieldset>
          <DialogFooter className="-mx-5 -mb-5 sm:-mx-7 sm:-mb-7">
            <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
            <Button type="submit">Save details</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ContactField({
  id,
  label,
  type = 'text',
  value,
}: {
  id: string;
  label: string;
  type?: 'email' | 'tel' | 'text';
  value?: string;
}) {
  return (
    <div className="space-y-3">
      <label className="block font-heading text-small leading-normal font-medium" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        defaultValue={value}
        placeholder={label === 'Portfolio' ? 'johndoe.design' : 'linkedin.com/in/you'}
      />
    </div>
  );
}

export { EditResumeContactDialog };
