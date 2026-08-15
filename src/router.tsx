import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { createQueryClient } from '@/shared/lib/query-client';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  const queryClient = createQueryClient();

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  });

  return router;
}

export const getRouter = createRouter;

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
