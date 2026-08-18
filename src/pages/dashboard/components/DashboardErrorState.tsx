import { CircleAlert } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

export function DashboardErrorState({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="min-h-24 items-start gap-3 p-4">
      <CircleAlert className="mt-0.5 size-icon-base" aria-hidden="true" />
      <div>
        <AlertTitle className="font-heading text-small font-semibold">Dashboard data unavailable</AlertTitle>
        <AlertDescription className="mt-1 text-small leading-relaxed">{message}</AlertDescription>
      </div>
    </Alert>
  );
}
