import { Outlet, createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';

export const Route = createFileRoute('/applications')({
  head: () => ({
    meta: [
      { title: 'Applications | JobApp' },
      { name: 'description', content: 'Track every application, follow-up, and next step in one focused workspace.' },
    ],
  }),
  beforeLoad: async () => await requireAuth(),
  component: ApplicationsLayout,
});

function ApplicationsLayout() {
  return <Outlet />;
}
