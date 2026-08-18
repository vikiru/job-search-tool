import { Link } from '@tanstack/react-router';
import { ExternalLink, MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import type { ApplicationStatus } from '@/server/db/zod';

import {
  useDeleteApplication,
  useUpdateApplicationStatus,
} from '@/features/applications/hooks/useApplicationMutations';
import { formatStatus, type ApplicationRecord } from '@/pages/applications/application-model';
import { ChangeStatusDialog } from '@/pages/applications/components/ChangeStatusDialog';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface ApplicationActionMenuProps {
  application: ApplicationRecord;
  context?: 'table' | 'kanban';
  userId: string;
}

function ApplicationActionMenu({ application, context = 'table', userId }: ApplicationActionMenuProps) {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const statusMutation = useUpdateApplicationStatus(userId, application.id);
  const deleteMutation = useDeleteApplication(userId, application.id);

  async function saveStatus(status: ApplicationStatus) {
    const result = await statusMutation.mutateAsync(status);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success('Application status updated.', {
      description: `Application changed from ${formatStatus(application.status)} to ${formatStatus(status)}.`,
    });
    return true;
  }

  async function deleteApplication() {
    const result = await deleteMutation.mutateAsync();
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Application deleted.');
    setDeleteDialogOpen(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="opacity-70 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
            variant="ghost"
            size="icon"
          />
        }
        aria-label={`Actions for ${application.company}`}
      >
        <MoreHorizontal className="size-icon-sm" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 p-2" align="end" sideOffset={8}>
        <DropdownMenuItem
          className="gap-2.5 py-2.5 font-heading text-small leading-normal font-medium tracking-tight"
          render={<Link to="/applications/$id" params={{ id: application.id }} />}
        >
          <ExternalLink className="size-icon-sm" aria-hidden="true" />
          View details
        </DropdownMenuItem>
        {context === 'table' && (
          <DropdownMenuItem
            className="gap-2.5 py-2.5 font-heading text-small leading-normal font-medium tracking-tight"
            onClick={() => setStatusDialogOpen(true)}
          >
            <RefreshCw className="size-icon-sm" aria-hidden="true" />
            Change status
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="my-1.5" />
        <DropdownMenuItem
          className="gap-2.5 py-2.5 font-heading text-small leading-normal font-medium tracking-tight"
          onClick={() => setDeleteDialogOpen(true)}
          variant="destructive"
        >
          <Trash2 className="size-icon-sm" aria-hidden="true" />
          Delete application
        </DropdownMenuItem>
      </DropdownMenuContent>
      {context === 'table' && (
        <ChangeStatusDialog
          application={application}
          isSubmitting={statusMutation.isPending}
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          onSave={saveStatus}
        />
      )}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        heading="Delete this application?"
        body="This will permanently remove the application, notes, links, and analysis connected to it. This action cannot be undone."
        actionLabel="Delete application"
        onConfirm={deleteApplication}
      />
    </DropdownMenu>
  );
}

export { ApplicationActionMenu };
