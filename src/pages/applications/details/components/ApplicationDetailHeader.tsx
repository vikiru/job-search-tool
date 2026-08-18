import { useNavigate } from '@tanstack/react-router';
import { BriefcaseBusiness, CalendarDays, MapPin, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useDeleteApplication } from '@/features/applications/hooks/useApplicationMutations';
import { formatApplicationDate, type ApplicationRecord } from '@/pages/applications/application-model';
import { EditApplicationDialog } from '@/pages/applications/components/EditApplicationDialog';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';

export function ApplicationDetailHeader({ application, userId }: { application: ApplicationRecord; userId: string }) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteApplication(userId, application.id);

  async function deleteApplication() {
    const result = await deleteMutation.mutateAsync();
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Application deleted.');
    await navigate({ to: '/applications' });
  }

  return (
    <header className="space-y-6 border-b border-border/70 pb-6 sm:pb-8">
      <div className="flex flex-col gap-5">
        <div className="min-w-0 space-y-3">
          <div>
            <h1 className="max-w-full font-heading text-h2 leading-[1.08] font-semibold tracking-tight text-balance break-words sm:max-w-[34ch] sm:text-h1">
              {application.position}
            </h1>
            <p className="mt-2 font-heading text-h4 font-medium text-muted-foreground">{application.company}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-small text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-icon-sm" aria-hidden="true" />
              {application.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-icon-sm" aria-hidden="true" />
              Added {formatApplicationDate(application.applicationDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-icon-sm" aria-hidden="true" />
              {application.source}
            </span>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <EditApplicationDialog application={application} userId={userId} />
            <ConfirmDialog
              trigger={
                <Button variant="destructive" className="w-full font-heading sm:w-auto">
                  <Trash2 data-icon="inline-start" aria-hidden="true" />
                  Delete application
                </Button>
              }
              heading="Delete this application?"
              body="This will permanently remove the application, notes, links, and analysis connected to it. This action cannot be undone."
              actionLabel="Delete application"
              onConfirm={deleteApplication}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
