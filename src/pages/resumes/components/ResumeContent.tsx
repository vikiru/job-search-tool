import type { ReactNode } from 'react';
import { MapPin } from 'lucide-react';

interface ResumeContentProps {
  name: string;
  title: string;
  location: string;
  summary: string;
  children: ReactNode;
}

interface ResumeSectionProps {
  heading: string;
  children: ReactNode;
}

interface ResumeRoleProps {
  company: string;
  description: string;
  position: string;
}

export function ResumeContent({ children, location, name, summary, title }: ResumeContentProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="font-heading text-h2 font-semibold leading-tight tracking-tight text-foreground">{name}</h2>
        <p className="font-heading text-p font-medium text-foreground">{title}</p>
        <p className="flex items-center gap-1.5 text-small text-muted-foreground">
          <MapPin className="size-icon-sm" aria-hidden="true" />
          {location}
        </p>
      </header>
      <p className="max-w-prose text-p leading-relaxed text-muted-foreground">{summary}</p>
      <div className="space-y-8">{children}</div>
    </div>
  );
}

export function ResumeSection({ children, heading }: ResumeSectionProps) {
  return (
    <section className="space-y-4" aria-labelledby={`resume-section-${heading.toLowerCase().replaceAll(' ', '-')}`}>
      <h3
        id={`resume-section-${heading.toLowerCase().replaceAll(' ', '-')}`}
        className="border-b border-border/70 pb-2 font-heading text-small font-semibold tracking-[0.08em] text-foreground uppercase"
      >
        {heading}
      </h3>
      {children}
    </section>
  );
}

export function ResumeRole({ company, description, position }: ResumeRoleProps) {
  return (
    <article className="space-y-2">
      <div>
        <h4 className="font-heading text-p font-semibold leading-snug text-foreground">{position}</h4>
        <p className="mt-0.5 font-heading text-small font-medium text-muted-foreground">{company}</p>
      </div>
      <p className="max-w-prose text-small leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}
