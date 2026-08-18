import { useState } from 'react';
import { ExternalLink, FileText, Link2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useApplicationLinks } from '@/features/applications/hooks/useApplicationMutations';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import type { SelectApplicationLink } from '@/server/db/zod';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
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

interface ApplicationLink {
  href: string;
  id: string;
  label: string;
}

export function ApplicationLinksCard({
  applicationId,
  userId,
  links: persistedLinks,
}: {
  applicationId: string;
  userId: string;
  links: SelectApplicationLink[];
}) {
  const links = persistedLinks.map((link) => ({
    href: link.url,
    id: link.id,
    label: link.label ?? 'Application link',
  }));
  const linkMutations = useApplicationLinks(userId, applicationId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ApplicationLink | null>(null);
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');

  function openAddDialog() {
    setEditingLink(null);
    setLabel('');
    setHref('');
    setDialogOpen(true);
  }

  function openEditDialog(link: ApplicationLink) {
    setEditingLink(link);
    setLabel(link.label);
    setHref(link.href);
    setDialogOpen(true);
  }

  async function saveLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = editingLink
      ? await linkMutations.update.mutateAsync({ id: editingLink.id, label: label.trim(), url: href.trim() })
      : await linkMutations.add.mutateAsync({ label: label.trim(), url: href.trim() });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(editingLink ? 'Link updated.' : 'Link added.');
    setDialogOpen(false);
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-heading text-h4 font-semibold">Links</CardTitle>
            <Button variant="outline" size="sm" className="shrink-0 font-heading" onClick={openAddDialog}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              <span className="hidden sm:inline">Add link</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
          <p className="max-w-full text-small leading-6 text-pretty text-muted-foreground">
            Keep the posting, portfolio, and other useful references close by.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {links.map((link) => (
            <ApplicationLinkRow
              key={link.id}
              link={link}
              onEdit={openEditDialog}
              onRemove={async () => {
                const result = await linkMutations.remove.mutateAsync(link.id);
                if (result.success) toast.success('Link removed.');
                else toast.error(result.error);
              }}
            />
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg p-5 sm:p-6">
          <DialogHeader className="gap-4 pr-8">
            <DialogTitle className="text-h4 font-semibold tracking-tight">
              {editingLink ? 'Edit link' : 'Add a link'}
            </DialogTitle>
            <DialogDescription className="max-w-md text-small leading-relaxed">
              Save a job posting, portfolio, interview notes, or another reference for this application.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-7" onSubmit={saveLink}>
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
              <label
                className="block font-heading text-small leading-normal font-medium"
                htmlFor="application-link-url"
              >
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
              <Button type="submit" disabled={linkMutations.add.isPending || linkMutations.update.isPending}>
                {editingLink ? 'Save link' : 'Add link'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ApplicationLinkRow({
  link,
  onEdit,
  onRemove,
}: {
  link: ApplicationLink;
  onEdit: (link: ApplicationLink) => void;
  onRemove: () => void;
}) {
  const icon =
    link.id === 'resume-used' ? (
      <FileText className="size-icon-sm shrink-0" aria-hidden="true" />
    ) : (
      <Link2 className="size-icon-sm shrink-0" aria-hidden="true" />
    );

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border/70 p-2">
      <a
        className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors motion-reduce:transition-none hover:bg-muted"
        href={link.href}
        target="_blank"
        rel="noreferrer"
      >
        {icon}
        <span className="min-w-0">
          <span className="block truncate font-heading text-small font-medium">{link.label}</span>
          <span className="block truncate font-mono text-caption text-muted-foreground">
            {link.href.replace(/^https?:\/\//, '')}
          </span>
        </span>
        <ExternalLink className="ml-auto size-icon-sm shrink-0 text-muted-foreground" aria-hidden="true" />
      </a>
      <Button variant="ghost" size="icon-sm" aria-label={`Edit ${link.label}`} onClick={() => onEdit(link)}>
        <Pencil aria-hidden="true" />
      </Button>
      <ConfirmDialog
        trigger={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${link.label}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        }
        heading={`Delete ${link.label}?`}
        body="This link will be removed from the application."
        actionLabel="Delete link"
        onConfirm={onRemove}
      />
    </div>
  );
}
