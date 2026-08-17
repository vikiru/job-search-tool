import { ExternalLink, MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';

import { ChangeStatusDialog } from '@/pages/applications/components/ChangeStatusDialog';
import type { ApplicationRecord } from '@/pages/applications/data';
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
}

function ApplicationActionMenu({ application, context = 'table' }: ApplicationActionMenuProps) {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="opacity-70 transition-opacity motion-reduce:transition-none group-hover:opacity-100"
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
          className="gap-2.5 py-2.5 font-heading text-small font-medium leading-normal tracking-tight"
          render={<Link to="/applications/$id" params={{ id: application.id }} />}
        >
          <ExternalLink className="size-icon-sm" aria-hidden="true" />
          View details
        </DropdownMenuItem>
        {context === 'table' && (
          <DropdownMenuItem
            className="gap-2.5 py-2.5 font-heading text-small font-medium leading-normal tracking-tight"
            onClick={() => setStatusDialogOpen(true)}
          >
            <RefreshCw className="size-icon-sm" aria-hidden="true" />
            Change status
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="my-1.5" />
        <DropdownMenuItem
          className="gap-2.5 py-2.5 font-heading text-small font-medium leading-normal tracking-tight"
          onClick={() => setDeleteDialogOpen(true)}
          variant="destructive"
        >
          <Trash2 className="size-icon-sm" aria-hidden="true" />
          Delete application
        </DropdownMenuItem>
      </DropdownMenuContent>
      <ChangeStatusDialog application={application} open={statusDialogOpen} onOpenChange={setStatusDialogOpen} />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        heading="Delete this application?"
        body="This will permanently remove the application, notes, links, and analysis connected to it. This action cannot be undone."
        actionLabel="Delete application"
      />
    </DropdownMenu>
  );
}

export { ApplicationActionMenu };
