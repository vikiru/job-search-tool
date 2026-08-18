import { Sparkles } from 'lucide-react';

export function ResumeInsightsSection() {
  return (
    <aside className="rounded-xl border border-border/70 bg-muted/30 p-5 sm:p-6">
      <Sparkles className="size-icon-base text-primary" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-h5 leading-tight font-semibold tracking-tight text-balance">
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
  );
}
