/* oxlint-disable jsx_a11y/prefer-tag-over-role -- status is the correct live-region semantics for loading. */

import { Spinner } from '@/shared/components/ui/spinner';
import { cn } from '@/shared/lib/utils';

interface LoaderProps extends React.ComponentProps<'div'> {
  label?: string;
}

export function Loader({ className, label = 'Loading', ...props }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('flex min-h-72 items-center justify-center', className)}
      {...props}
    >
      <Spinner aria-label={label} className="size-icon-lg text-muted-foreground" />
    </div>
  );
}
