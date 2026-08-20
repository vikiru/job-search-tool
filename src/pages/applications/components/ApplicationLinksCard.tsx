import { ExternalLink, FileText, Link2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import type { SelectApplicationLink } from '@/server/db/zod';

import { useApplicationLinks } from '@/features/application-data/useApplicationLinks';
import {
  ApplicationLinkDialog,
  type ApplicationLinkFormValues,
} from '@/pages/applications/components/ApplicationLinkDialog';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

interface ApplicationLink {
  href: string;
  id: string;
  label: string;
}

interface ApplicationLinksCardProps {
  applicationId: string;
  links: SelectApplicationLink[];
  userId: string;
}

export function ApplicationLinksCard({ applicationId, userId, links: persistedLinks }: ApplicationLinksCardProps) {
  const links = persistedLinks.map((link) => ({
    href: link.url,
    id: link.id,
    label: link.label ?? 'Application link',
  }));
  const linkMutations = useApplicationLinks(userId, applicationId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ApplicationLink | null>(null);
  const isSavingLink = linkMutations.add.isPending || linkMutations.update.isPending;
  const linksContent = (
    <div className="space-y-3">
      {links.map((link) => (
        <ApplicationLinkRow key={link.id} link={link} onEdit={openEditDialog} onRemove={() => removeLink(link.id)} />
      ))}
    </div>
  );

  function openAddDialog() {
    setEditingLink(null);
    setDialogOpen(true);
  }

  function openEditDialog(link: ApplicationLink) {
    setEditingLink(link);
    setDialogOpen(true);
  }

  async function removeLink(linkId: string) {
    const result = await linkMutations.remove.mutateAsync(linkId);
    if (result.success) toast.success('Link removed.');
    else toast.error(result.error);
  }

  async function saveLink(values: ApplicationLinkFormValues) {
    const result = values.id
      ? await linkMutations.update.mutateAsync({ id: values.id, label: values.label, url: values.href })
      : await linkMutations.add.mutateAsync({ label: values.label, url: values.href });
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success(values.id ? 'Link updated.' : 'Link added.');
    return true;
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
        <CardContent>
          {links.length > 5 ? (
            <ScrollArea className="h-52 pr-2 sm:h-64" aria-label="Application links">
              {linksContent}
            </ScrollArea>
          ) : (
            linksContent
          )}
        </CardContent>
      </Card>

      <ApplicationLinkDialog
        initialValues={editingLink}
        isOpen={dialogOpen}
        isSubmitting={isSavingLink}
        onOpenChange={setDialogOpen}
        onSubmit={saveLink}
      />
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
  onRemove: () => void | Promise<void>;
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
        className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted motion-reduce:transition-none"
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
