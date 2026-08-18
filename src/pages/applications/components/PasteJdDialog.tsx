import { useState } from 'react';
import { FilePenLine, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { useCreateApplication } from '@/features/applications/hooks/useApplicationMutations';
import { AiApplicationForm } from '@/pages/applications/components/AiApplicationForm';
import {
  ManualApplicationForm,
  type ManualApplicationSubmitValues,
} from '@/pages/applications/components/ManualApplicationForm';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

function PasteJdDialog({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const createApplication = useCreateApplication(userId);
  const [open, setOpen] = useState(false);

  async function saveManualApplication(values: ManualApplicationSubmitValues) {
    const result = await createApplication.mutateAsync({
      applicationUrl: values.applicationUrl,
      company: values.company,
      interestRating: values.interestRating,
      jobDescriptionMd: values.jobDescriptionMd,
      location: values.location,
      position: values.position,
      source: values.source,
      status: values.status,
      workArrangement: values.workArrangement ? (values.workArrangement as 'REMOTE' | 'HYBRID' | 'ONSITE') : null,
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Application added');
    setOpen(false);
    await navigate({ to: '/applications/$id', params: { id: result.data.id } });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full font-heading sm:w-auto" size="lg">
            <FileText data-icon="inline-start" aria-hidden="true" />
            Add application
          </Button>
        }
      />
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl gap-7 overflow-y-auto p-5 sm:max-h-[calc(100dvh-3rem)] sm:max-w-3xl sm:p-7">
        <DialogHeader className="gap-3 pr-8">
          <DialogTitle className="font-heading text-h3 font-semibold leading-tight tracking-tight">
            Add an application
          </DialogTitle>
          <DialogDescription className="max-w-prose text-small leading-relaxed text-pretty">
            Start with a job description or enter the details yourself. You can refine everything from the application
            page.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="ai" className="gap-5">
          <TabsList className="grid h-10 w-full grid-cols-2" aria-label="Application entry method">
            <TabsTrigger value="ai" className="font-heading">
              <Sparkles data-icon="inline-start" aria-hidden="true" />
              Use AI
            </TabsTrigger>
            <TabsTrigger value="manual" className="font-heading">
              <FilePenLine data-icon="inline-start" aria-hidden="true" />
              Enter manually
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ai">
            <AiApplicationForm />
          </TabsContent>
          <TabsContent value="manual">
            <ManualApplicationForm
              isSubmitting={createApplication.isPending}
              onSubmit={saveManualApplication}
              submitLabel={createApplication.isPending ? 'Saving…' : 'Save application'}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export { PasteJdDialog };
