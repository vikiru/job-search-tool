import { useRef, useState } from 'react';
import { FileUp, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { MAX_RESUME_FILE_SIZE } from '@/features/resumes/constants';
import { useUploadResume } from '@/features/resumes/hooks/useResumes';
import { Spinner } from '@/shared/components/ui/spinner';

interface ResumeUploaderProps {
  userId: string;
}

function validateFile(file: File): string | null {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return 'Please choose a PDF file.';
  }

  if (file.size > MAX_RESUME_FILE_SIZE) {
    return 'Resume files must be 5 MB or smaller.';
  }

  return null;
}

export function ResumeUploader({ userId }: ResumeUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const upload = useUploadResume(userId);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    const result = await upload.mutateAsync(file);
    if (!result.success) {
      setError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success('Resume uploaded');
  }

  return (
    <div className="w-full space-y-4">
      <label
        htmlFor="resume-upload"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void handleFile(event.dataTransfer.files[0]);
        }}
        aria-disabled={upload.isPending}
        className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/35 bg-primary/[0.03] px-5 py-8 text-center transition-colors motion-reduce:transition-none hover:border-primary/60 hover:bg-primary/[0.06] has-[:disabled]:pointer-events-none has-[:disabled]:opacity-70 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform motion-reduce:transition-none group-hover:-translate-y-0.5">
          {upload.isPending ? (
            <Spinner className="size-icon-lg" />
          ) : (
            <FileUp className="size-icon-lg" aria-hidden="true" />
          )}
        </span>
        <span className="mt-4 font-heading text-p font-semibold leading-tight tracking-tight">
          {upload.isPending ? 'Processing your resume…' : 'Drop your resume here'}
        </span>
        <span className="mt-2 max-w-md text-small leading-relaxed text-muted-foreground">
          Or choose a PDF from your device. We’ll extract the text so you can review it before using it for analysis.
        </span>
        <span className="mt-4 inline-flex h-9 items-center rounded-lg bg-primary px-3 font-heading text-small font-medium text-primary-foreground">
          {upload.isPending ? 'Working…' : 'Choose PDF'}
        </span>
        <input
          ref={inputRef}
          id="resume-upload"
          className="sr-only"
          type="file"
          accept="application/pdf,.pdf"
          disabled={upload.isPending}
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </label>
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-caption leading-relaxed text-muted-foreground">
        <ShieldCheck className="size-icon-sm text-success" aria-hidden="true" />
        <span className="font-heading font-medium text-foreground">PDF only · up to 5 MB</span>
        <span aria-hidden="true">·</span>
        <span>Converted to text. Original file isn’t stored.</span>
      </p>
      {error ? (
        <p className="text-center text-small leading-relaxed text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
