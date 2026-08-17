import { Pencil } from 'lucide-react';

import { ManualApplicationForm } from '@/pages/applications/components/ManualApplicationForm';
import { getApplicationJobDescription, type ApplicationRecord } from '@/pages/applications/data';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

function EditApplicationDialog({ application }: { application: ApplicationRecord }) {
  return (
    <Dialog>
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
            jobDescription: getApplicationJobDescription(application),
          }}
          submitLabel="Save changes"
        />
      </DialogContent>
    </Dialog>
  );
}

export { EditApplicationDialog };
