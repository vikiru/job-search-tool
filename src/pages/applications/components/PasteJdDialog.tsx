import { FilePenLine, FileText, Sparkles } from 'lucide-react';

import { AiApplicationForm } from '@/pages/applications/components/AiApplicationForm';
import { ManualApplicationForm } from '@/pages/applications/components/ManualApplicationForm';
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

function PasteJdDialog() {
  return (
    <Dialog>
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
            <ManualApplicationForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export { PasteJdDialog };
