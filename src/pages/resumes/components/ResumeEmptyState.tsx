import { FileText } from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import { ResumeUploader } from '@/pages/resumes/components/ResumeUploader';

function ResumeEmptyState() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Empty className="min-h-96 rounded-none border-0 px-5 py-10 sm:px-7 sm:py-14">
          <EmptyMedia className="rounded-lg bg-primary/10 text-primary" variant="icon">
            <FileText className="size-icon-base" aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader className="max-w-2xl">
            <EmptyTitle className="text-h4">Add your resume</EmptyTitle>
            <EmptyDescription>
              Keep one trusted version ready for comparing your experience with the roles you’re considering.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <ResumeUploader />
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

export { ResumeEmptyState };
