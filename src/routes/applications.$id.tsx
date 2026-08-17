import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';

export const Route = createFileRoute('/applications/$id')({
  beforeLoad: async () => {
    await requireAuth();
  },
  component: ApplicationDetailRoute,
});

function ApplicationDetailRoute() {
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" />;
}
