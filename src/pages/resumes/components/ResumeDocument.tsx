import type { ReactNode } from 'react';

import { FileText, RefreshCw, Trash2 } from 'lucide-react';
import { useRef } from 'react';

import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Spinner } from '@/shared/components/ui/spinner';

interface ResumeDocumentProps {
  createdAt: Date;
  filename: string;
  isDeleting: boolean;
  isReplacing: boolean;
  onDelete: () => void;
  onReplace: (file: File) => void;
  children: ReactNode;
}

function ResumeDocument({
  children,
  createdAt,
  filename,
  isDeleting,
  isReplacing,
  onDelete,
  onReplace,
}: ResumeDocumentProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="min-w-0">
      <CardHeader className="gap-4 border-b border-border/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-icon-sm" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-heading text-h4 font-semibold tracking-tight">{filename}</CardTitle>
              <Badge variant="secondary" className="font-heading text-caption">
                Current
              </Badge>
            </div>
            <p className="mt-1 text-small leading-relaxed text-muted-foreground">
              PDF · Added {createdAt.toLocaleDateString('en-CA')}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isReplacing}
            onClick={() => inputRef.current?.click()}
          >
            <RefreshCw data-icon="inline-start" aria-hidden="true" />
            {isReplacing ? 'Replacing…' : 'Replace resume'}
          </Button>
          <ConfirmDialog
            actionLabel="Delete resume"
            body="This permanently removes the extracted resume text from your workspace. Your original PDF was never stored."
            heading={`Delete ${filename}?`}
            onConfirm={onDelete}
            trigger={
              <Button type="button" variant="destructive" size="sm" disabled={isDeleting || isReplacing}>
                {isDeleting ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Trash2 data-icon="inline-start" aria-hidden="true" />
                )}
                {isDeleting ? 'Deleting…' : 'Delete resume'}
              </Button>
            }
          />
          <input
            ref={inputRef}
            id="replace-resume"
            className="sr-only"
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onReplace(file);
              event.target.value = '';
            }}
          />
        </div>
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
