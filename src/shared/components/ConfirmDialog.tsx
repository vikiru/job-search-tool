import type { ReactElement } from 'react';
import { CircleAlert } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';

interface ConfirmDialogProps {
  actionLabel: string;
  body: string;
  cancelLabel?: string;
  heading: string;
  onConfirm?: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  trigger?: ReactElement;
}

function ConfirmDialog({
  actionLabel,
  body,
  cancelLabel = 'Cancel',
  heading,
  onConfirm,
  onOpenChange,
  open,
  trigger,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger render={trigger} />}
      <AlertDialogContent className="max-w-lg gap-7 p-6 sm:max-w-lg sm:p-7">
        <AlertDialogHeader className="place-items-start gap-3 text-left">
          <AlertDialogMedia className="size-11 rounded-full bg-destructive/10 text-destructive">
            <CircleAlert className="size-icon-base" aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-heading text-h3 font-semibold leading-tight tracking-tight">
            {heading}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-small leading-relaxed text-pretty">{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mx-0 mb-0 gap-2 rounded-none border-t border-border/60 bg-transparent p-0 pt-5 sm:justify-end">
          <AlertDialogCancel className="font-heading">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction className="font-heading" variant="destructive" onClick={onConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmDialog };
