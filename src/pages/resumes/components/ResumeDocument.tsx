import type { ReactNode } from 'react';
import { FileText, RefreshCw } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

interface ResumeDocumentProps {
  filename: string;
  children: ReactNode;
}

function ResumeDocument({ children, filename }: ResumeDocumentProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="gap-4 border-b border-border/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-icon-base" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-heading text-h4 font-semibold tracking-tight">{filename}</CardTitle>
              <Badge variant="secondary" className="font-heading text-caption">
                Current
              </Badge>
            </div>
            <p className="mt-1 text-small leading-relaxed text-muted-foreground">PDF · Added August 17, 2026</p>
          </div>
        </div>
        <label htmlFor="replace-resume" className="inline-flex shrink-0 cursor-pointer items-center justify-center">
          <Button render={<span />} variant="outline" size="sm">
            <RefreshCw data-icon="inline-start" aria-hidden="true" />
            Replace resume
          </Button>
          <input id="replace-resume" className="sr-only" type="file" accept="application/pdf" />
        </label>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[min(34rem,65vh)]">
          <article className="px-5 py-7 sm:px-8 sm:py-9">{children}</article>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export { ResumeDocument };
