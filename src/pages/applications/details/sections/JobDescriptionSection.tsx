import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ApplicationRecord } from '@/pages/applications/data';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';

export function JobDescriptionSection({ application }: { application: ApplicationRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-h4 font-semibold">Job description</CardTitle>
        <p className="text-small leading-relaxed text-muted-foreground">
          Keep the role context close while you prepare your application and next steps.
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-5 text-small leading-relaxed text-muted-foreground">
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-heading prose-headings:text-foreground prose-p:my-3 prose-li:my-1">
          <Markdown remarkPlugins={[remarkGfm]}>
            {application.jobDescriptionMd ?? 'No job description added yet.'}
          </Markdown>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {application.technologies.map((technology) => (
            <Badge key={technology} variant="secondary" className="font-heading text-caption">
              {technology}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
