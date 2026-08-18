import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ApplicationRecord } from '@/pages/applications/data';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';

export function JobDescriptionSection({
  application,
  showExtractedMetadata,
}: {
  application: ApplicationRecord;
  showExtractedMetadata: boolean;
}) {
  const skillTerms = [...new Set([...application.technologies, ...(application.skills ?? [])])];
  const applicationInstructions = application.applicationInstructions ?? [];
  const hasExtractedDetails = showExtractedMetadata && (applicationInstructions.length > 0 || skillTerms.length > 0);
  const displayJobDescription = removeRedundantAboutHeading(
    application.jobDescriptionMd ?? 'No job description added yet.',
  );

  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle className="font-heading text-h4 font-semibold">Job description</CardTitle>
        <p className="max-w-[62ch] text-small leading-6 text-pretty text-muted-foreground">
          Keep the role context close while you prepare your application and next steps.
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-9 sm:p-7">
        <article className="max-w-[74ch] text-[0.9375rem] leading-7 text-foreground/85 sm:text-base">
          <Markdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
            {displayJobDescription}
          </Markdown>
        </article>
        {hasExtractedDetails && (
          <>
            <Separator />
            <div className="space-y-1">
              <h2 className="font-heading text-h4 font-semibold tracking-tight text-foreground">Extracted details</h2>
              <p className="text-small leading-6 text-muted-foreground">
                Structured details identified from this job description.
              </p>
            </div>
            {applicationInstructions.length > 0 && (
              <div className="max-w-[72ch]">
                <PostingList title="Application instructions" items={applicationInstructions} />
              </div>
            )}
            {skillTerms.length > 0 && (
              <div className="max-w-[72ch] space-y-4">
                <div className="space-y-1">
                  <h3 className="font-heading text-h4 font-semibold tracking-tight text-foreground">
                    Skills & technologies
                  </h3>
                  <p className="text-small leading-6 text-muted-foreground">
                    Technologies and tools called out in the posting.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skillTerms.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-md px-2.5 py-1 font-heading text-small font-medium capitalize"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function removeRedundantAboutHeading(value: string) {
  return value
    .replace(/^\s*#{1,6}\s+about the job\s*$/gim, '')
    .replace(/^\s*about the job\s+/i, '')
    .trim();
}

function PostingList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3.5">
      <h3 className="font-heading text-h4 font-semibold leading-tight tracking-tight text-foreground">{title}</h3>
      <ul className="max-w-[68ch] space-y-2.5 text-[0.9375rem] leading-7 text-foreground/80">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[0.72em] size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h2 className="mt-0 mb-5 font-heading text-h3 font-semibold leading-tight tracking-tight text-foreground">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 font-heading text-h4 font-semibold leading-tight tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 font-heading text-p font-semibold leading-snug text-foreground">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 mb-2 font-heading text-small font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="my-4 max-w-[68ch] text-pretty first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-5 list-disc space-y-2.5 pl-6 marker:text-primary">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-2.5 pl-6 marker:font-medium marker:text-primary">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-primary/40 pl-4 italic text-muted-foreground">{children}</blockquote>
  ),
  hr: () => <hr className="my-8 border-border/70" />,
};
