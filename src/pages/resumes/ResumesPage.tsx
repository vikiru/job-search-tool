import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { useResumes } from '@/features/resumes/hooks/useResumes';
import { ResumeEmptyState } from '@/pages/resumes/components/ResumeEmptyState';
import { ResumeContentSection } from '@/pages/resumes/sections/ResumeContentSection';
import { ResumeInsightsSection } from '@/pages/resumes/sections/ResumeInsightsSection';

interface ResumesPageProps {
  userId: string;
}

export function ResumesPage({ userId }: ResumesPageProps) {
  const resumeQuery = useResumes(userId);
  const resumeResult = resumeQuery.data;
  const resume = resumeResult?.success ? resumeResult.data : null;
  const errorMessage = resumeResult && !resumeResult.success ? resumeResult.error : null;

  return (
    <div className="mx-auto max-w-[var(--breakpoint-2xl)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-6 sm:space-y-8">
        <header className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-h1 font-semibold leading-tight tracking-tight">Your resume</h1>
            <p className="mt-3 max-w-3xl text-p leading-relaxed text-pretty text-muted-foreground">
              Keep the version you trust close by, then use it to make every fit comparison more useful.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 font-heading text-small font-medium text-muted-foreground transition-colors motion-reduce:transition-none hover:text-foreground"
            to="/applications"
          >
            View applications
            <ArrowRight className="size-icon-sm" aria-hidden="true" />
          </Link>
        </header>

        <section
          aria-labelledby="resume-start-heading"
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-8"
        >
          <div className="min-w-0">
            <h2 id="resume-start-heading" className="sr-only">
              Current resume
            </h2>
            {!resumeQuery.isPending && errorMessage ? (
              <p
                className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-small text-destructive"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}
            {!resumeQuery.isPending && !errorMessage && resume ? (
              <ResumeContentSection resume={resume} userId={userId} />
            ) : null}
            {!resumeQuery.isPending && !errorMessage && !resume ? <ResumeEmptyState userId={userId} /> : null}
          </div>
          <ResumeInsightsSection />
        </section>
      </div>
    </div>
  );
}
