import { ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useRemoveResume, useUploadResume, type ResumeData } from '@/features/resumes/hooks/useResumes';
import { parseResumeText } from '@/features/resumes/parser/parseResumeText';
import { ParsedResumeContent } from '@/pages/resumes/components/ParsedResumeContent';
import { ResumeContactDetails } from '@/pages/resumes/components/ResumeContactDetails';
import { ResumeDocument } from '@/pages/resumes/components/ResumeDocument';

interface ResumeContentSectionProps {
  resume: ResumeData;
  userId: string;
}

export function ResumeContentSection({ resume, userId }: ResumeContentSectionProps) {
  const parsedResume = useMemo(() => parseResumeText(resume.extractedText), [resume.extractedText]);
  const upload = useUploadResume(userId);
  const remove = useRemoveResume(userId);
  const [replaceError, setReplaceError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function replaceResume(file: File) {
    setReplaceError(null);
    const result = await upload.mutateAsync(file);
    if (!result.success) {
      setReplaceError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success('Resume replaced');
  }

  async function deleteResume() {
    setDeleteError(null);
    const result = await remove.mutateAsync();
    if (!result.success) {
      setDeleteError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success('Resume deleted');
  }

  return (
    <div className="space-y-6">
      <ResumeDocument
        createdAt={resume.createdAt}
        filename={resume.filename}
        isDeleting={remove.isPending}
        isReplacing={upload.isPending}
        onDelete={() => void deleteResume()}
        onReplace={(file) => void replaceResume(file)}
      >
        <ParsedResumeContent parsedResume={parsedResume} />
      </ResumeDocument>
      {replaceError ? (
        <p className="text-small leading-relaxed text-destructive" role="alert">
          {replaceError}
        </p>
      ) : null}
      {deleteError ? (
        <p className="text-small leading-relaxed text-destructive" role="alert">
          {deleteError}
        </p>
      ) : null}
      <ResumeContactDetails links={parsedResume.links} />
      <div className="flex items-start gap-3 rounded-lg border border-success/20 bg-success/5 px-4 py-4 sm:px-5">
        <ShieldCheck className="mt-0.5 size-icon-base shrink-0 text-success" aria-hidden="true" />
        <div className="min-w-0 space-y-1">
          <p className="font-heading text-small font-semibold leading-snug tracking-tight">
            Your source file stays private
          </p>
          <p className="max-w-prose text-small leading-relaxed text-pretty text-muted-foreground">
            We process your PDF securely and don’t store the original file. JobApp keeps the extracted text so you can
            review it and use it for fit analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
