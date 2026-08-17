import { FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ResumeUploader } from '@/pages/resumes/components/ResumeUploader';

function ResumeEmptyState() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/60 bg-muted/25 px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-icon-base" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <CardTitle className="font-heading text-h4 font-semibold tracking-tight">Add your resume</CardTitle>
            <p className="mt-1 max-w-2xl text-small leading-relaxed text-muted-foreground">
              Keep one trusted version ready for comparing your experience with the roles you’re considering.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-7">
        <ResumeUploader />
      </CardContent>
    </Card>
  );
}

export { ResumeEmptyState };
