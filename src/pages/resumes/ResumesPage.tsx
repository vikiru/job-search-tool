import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { ResumePresentState } from '@/pages/resumes/components/ResumePresentState';

function ResumesPage() {
  return (
    <div className="mx-auto max-w-[var(--breakpoint-2xl)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-6 sm:space-y-8">
        <header className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-h1 font-semibold leading-tight tracking-tight">Your resume</h1>
            <p className="mt-3 max-w-xl text-p leading-relaxed text-pretty text-muted-foreground">
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
            <ResumePresentState />
          </div>
          <aside className="rounded-xl border border-border/70 bg-muted/30 p-5 sm:p-6">
            <Sparkles className="size-icon-base text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-heading text-h5 font-semibold leading-tight tracking-tight text-balance">
              Make more of your resume
            </h2>
            <p className="mt-3 max-w-prose text-small leading-relaxed text-pretty text-muted-foreground">
              Keep the text you trust ready when you want to compare your experience with a role.
            </p>
            <ul className="mt-6 space-y-4 text-small leading-relaxed text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                Compare your experience with a job description
              </li>
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                Spot strengths worth bringing into an interview
              </li>
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                Review and refine the extracted text
              </li>
            </ul>
          </aside>
        </section>
      </div>
    </div>
  );
}

export { ResumesPage };
