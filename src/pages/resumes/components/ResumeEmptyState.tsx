import { Check, FileText } from 'lucide-react';

import { ResumeUploader } from '@/pages/resumes/components/ResumeUploader';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';

interface ResumeEmptyStateProps {
  userId: string;
}

export function ResumeEmptyState({ userId }: ResumeEmptyStateProps) {
  return (
    <Empty className="flex-none items-stretch gap-8 rounded-xl border border-border/70 bg-card p-5 text-left shadow-sm sm:p-8 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(20rem,1fr)] lg:gap-12 lg:p-10">
      <div className="flex min-w-0 flex-col justify-center">
        <EmptyMedia className="size-12 rounded-xl bg-primary/10 text-primary" variant="icon">
          <FileText className="size-icon-lg" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader className="mt-6 max-w-xl items-start gap-3">
          <EmptyTitle className="text-h3 text-balance">Start with the resume you trust</EmptyTitle>
          <EmptyDescription className="max-w-lg text-p text-pretty">
            Upload a PDF and JobApp will turn it into editable text you can review before comparing your experience with
            a role.
          </EmptyDescription>
        </EmptyHeader>
        <ul className="mt-8 grid gap-3 text-small leading-relaxed text-muted-foreground">
          <li className="flex items-start gap-3">
            <Check className="mt-0.5 size-icon-sm shrink-0 text-success" aria-hidden="true" />
            <span>Keep the details you trust ready for every application.</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="mt-0.5 size-icon-sm shrink-0 text-success" aria-hidden="true" />
            <span>Review and correct the extracted text before you use it.</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="mt-0.5 size-icon-sm shrink-0 text-success" aria-hidden="true" />
            <span>Keep your original PDF private. Only extracted text is saved.</span>
          </li>
        </ul>
      </div>
      <EmptyContent className="max-w-none items-stretch justify-center">
        <ResumeUploader userId={userId} />
      </EmptyContent>
    </Empty>
  );
}
