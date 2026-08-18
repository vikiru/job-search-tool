/* oxlint-disable tailwindcss/no-unknown-classes -- Sonner requires its external toaster hook class. */

import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useTheme } from '@/shared/components/ThemeProvider';

const Toaster = ({ ...props }: ToasterProps) => {
  const TOAST_DURATION_MS = 5000;
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      position="bottom-right"
      theme={theme as ToasterProps['theme']}
      richColors
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin motion-reduce:animate-none" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        duration: TOAST_DURATION_MS,
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
