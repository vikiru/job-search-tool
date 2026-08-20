import { MapPin } from 'lucide-react';

import type { ParsedResume, ParsedResumeSection, ResumeEntry } from '@/entities/resume/types';

interface ParsedResumeContentProps {
  parsedResume: ParsedResume;
}

export function ParsedResumeContent({ parsedResume }: ParsedResumeContentProps) {
  const { header } = parsedResume;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        {header.name ? (
          <h2 className="font-heading text-h2 leading-tight font-semibold tracking-tight text-foreground">
            {header.name}
          </h2>
        ) : null}
        {header.title ? <p className="font-heading text-p font-medium text-foreground">{header.title}</p> : null}
        {header.location ? (
          <p className="flex items-center gap-1.5 text-small text-muted-foreground">
            <MapPin className="size-icon-sm" aria-hidden="true" />
            {header.location}
          </p>
        ) : null}
        {header.summary ? (
          <p className="max-w-prose pt-3 text-p leading-relaxed text-muted-foreground">{header.summary}</p>
        ) : null}
      </header>
      <div className="space-y-8">
        {parsedResume.sections.map((section) => (
          <ParsedResumeSection key={`${section.kind}-${section.heading}`} section={section} />
        ))}
      </div>
    </div>
  );
}

function ParsedResumeSection({ section }: { section: ParsedResumeSection }) {
  const sectionId = `resume-section-${section.heading.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`;

  return (
    <section className="space-y-4" aria-labelledby={sectionId}>
      <h3
        id={sectionId}
        className="border-b border-border/70 pb-2 font-heading text-small font-semibold tracking-[0.08em] text-foreground uppercase"
      >
        {section.heading}
      </h3>
      {section.skillGroups.length > 0 ? (
        <div className="space-y-3">
          {section.skillGroups.map((group) => (
            <div key={group.label} className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
              <p className="font-heading text-small font-semibold text-foreground">{group.label}</p>
              <p className="text-small leading-relaxed text-muted-foreground">{group.values.join(', ')}</p>
            </div>
          ))}
        </div>
      ) : section.entries.length > 0 ? (
        <div className="space-y-6">
          {section.entries.map((entry, index) => (
            <ParsedResumeEntry key={`${entry.heading ?? 'entry'}-${index}`} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="max-w-prose text-small leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {section.lines.join('\n')}
        </p>
      )}
    </section>
  );
}

function ParsedResumeEntry({ entry }: { entry: ResumeEntry }) {
  return (
    <article className="space-y-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          {entry.heading ? (
            <h4 className="font-heading text-p leading-snug font-semibold text-foreground">{entry.heading}</h4>
          ) : null}
          {entry.subheading ? (
            <p className="font-heading text-small font-medium text-muted-foreground">{entry.subheading}</p>
          ) : null}
        </div>
        {entry.dateRange ? (
          <p className="shrink-0 font-mono text-caption text-muted-foreground">{entry.dateRange}</p>
        ) : null}
      </div>
      {entry.technologies.length > 0 ? (
        <p className="text-caption leading-relaxed text-muted-foreground">{entry.technologies.join(' · ')}</p>
      ) : null}
      {entry.bullets.length > 0 ? (
        <ul className="space-y-2 pl-4 text-small leading-relaxed text-muted-foreground">
          {entry.bullets.map((bullet) => (
            <li key={bullet} className="list-disc pl-1">
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      {entry.lines.length > 0 ? (
        <p className="max-w-prose text-small leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {entry.lines.join('\n')}
        </p>
      ) : null}
    </article>
  );
}
