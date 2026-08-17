import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';

export const Route = createFileRoute('/dashboard')({
  head: () => ({
    meta: [
      { title: 'Dashboard | JobApp' },
      {
        name: 'description',
        content: 'Keep your next step visible with a clear view of your applications and activity.',
      },
    ],
  }),
  beforeLoad: async () => await requireAuth(),
  component: DashboardRoute,
});

function DashboardRoute() {
  return <DashboardPage />;
}
