import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { useAnalyzeApplication } from '@/features/gemini/analysis/hooks/useAnalyzeApplication';
import { useResumes } from '@/features/resumes/hooks/useResumes';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';

interface AnalyzeMatchDialogProps {
  applicationId: string;
  userId: string;
}

export function AnalyzeMatchDialog({ applicationId, userId }: AnalyzeMatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const resumeQuery = useResumes(userId);
  const analyzeMutation = useAnalyzeApplication(userId, applicationId);

  useEffect(() => {
    if (!open || !resumeQuery.data?.success || !resumeQuery.data.data) return;
    setResumeText(resumeQuery.data.data.extractedText);
  }, [open, resumeQuery.data]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await analyzeMutation.mutateAsync(resumeText);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Fit analysis updated.', {
      description: `${result.data.matchScore}% match based on your resume and this role.`,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="shrink-0 font-heading" size="sm">
            <Sparkles data-icon="inline-start" aria-hidden="true" />
            Analyze match
          </Button>
        }
      />
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto p-5 sm:max-h-[calc(100dvh-3rem)] sm:max-w-3xl sm:p-7">
        <DialogHeader className="gap-3 pr-8">
          <DialogTitle className="font-heading text-h3 font-semibold leading-tight tracking-tight">
            Compare your fit
          </DialogTitle>
          <DialogDescription className="max-w-prose text-small leading-relaxed text-pretty">
            Use your saved resume or adjust the text below before generating a detailed comparison with this role.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="analysis-resume" className="font-heading text-small font-medium tracking-tight">
              Resume text <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              id="analysis-resume"
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              className="min-h-72 resize-y text-small leading-relaxed"
              placeholder="Paste your resume text or leave this blank for JD-only observations."
              disabled={analyzeMutation.isPending}
            />
            <p className="text-caption leading-relaxed text-muted-foreground">
              Your resume text is used for this analysis and is not shown in the result.
            </p>
          </div>
          <DialogFooter className="gap-2 border-t border-border/60 pt-5 sm:justify-end">
            <DialogClose
              render={<Button variant="ghost" className="font-heading" disabled={analyzeMutation.isPending} />}
            >
              Cancel
            </DialogClose>
            <Button type="submit" className="font-heading" disabled={analyzeMutation.isPending}>
              <Sparkles data-icon="inline-start" aria-hidden="true" />
              {analyzeMutation.isPending ? 'Analyzing…' : 'Analyze match'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
