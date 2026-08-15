import * as React from 'react';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouteContext,
  Link,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from '@/shared/components/ui/button';
import appCss from '@/styles/app.css?url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Job Search OS',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = useRouteContext({ from: '__root__' });

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-primary/20">
          <Outlet />
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-destructive">Something went wrong</h1>
        <p className="text-sm text-muted-foreground font-body">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function RootNotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="font-heading text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
        <p className="text-sm text-muted-foreground font-body">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
