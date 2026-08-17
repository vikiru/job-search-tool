import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    await requireAuth();
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" />;
}
