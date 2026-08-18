import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useUpdateApplication } from '@/features/applications/hooks/useApplicationMutations';
import { ManualApplicationForm } from '@/pages/applications/components/ManualApplicationForm';
import type { ApplicationRecord } from '@/pages/applications/data';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

function EditApplicationDialog({ application, userId }: { application: ApplicationRecord; userId: string }) {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateApplication(userId, application.id);

  async function saveApplication(
    values: Parameters<NonNullable<React.ComponentProps<typeof ManualApplicationForm>['onSubmit']>>[0],
  ) {
    const result = await updateMutation.mutateAsync({
      id: application.id,
      data: {
        applicationUrl: values.applicationUrl,
        company: values.company,
        interestRating: values.interestRating,
        jobDescriptionMd: values.jobDescriptionMd,
        location: values.location,
        position: values.position,
        source: values.source,
        status: values.status,
        workArrangement: values.workArrangement as 'REMOTE' | 'HYBRID' | 'ONSITE' | undefined,
      },
    });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Application updated.');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="font-heading">
            <Pencil data-icon="inline-start" aria-hidden="true" />
            Edit application
          </Button>
        }
      />
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl gap-7 overflow-y-auto p-5 sm:max-h-[calc(100dvh-3rem)] sm:max-w-3xl sm:p-7">
        <DialogHeader className="gap-3 pr-8">
          <DialogTitle className="font-heading text-h3 font-semibold leading-tight tracking-tight">
            Edit application
          </DialogTitle>
          <DialogDescription className="max-w-prose text-small leading-relaxed text-pretty">
            Update the details you want to keep current for this opportunity.
          </DialogDescription>
        </DialogHeader>
        <ManualApplicationForm
          idPrefix="edit-application"
          initialValues={{
            company: application.company,
            position: application.position,
            location: application.location,
            source: application.source,
            status: application.status,
            interestRating: application.interestRating,
            applicationUrl: application.applicationUrl ?? '',
            jobDescription: application.jobDescriptionMd ?? '',
            workArrangement: application.workArrangement ?? '',
          }}
          isSubmitting={updateMutation.isPending}
          onSubmit={saveApplication}
          submitLabel="Save changes"
        />
      </DialogContent>
    </Dialog>
  );
}

export { EditApplicationDialog };
