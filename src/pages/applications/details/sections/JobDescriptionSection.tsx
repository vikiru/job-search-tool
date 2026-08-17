import { getApplicationJobDescription, type ApplicationRecord } from '@/pages/applications/data';
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
        {getApplicationJobDescription(application)
          .split('\n\n')
          .map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
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
