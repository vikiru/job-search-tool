import { createFileRoute } from '@tanstack/react-router';

import { getUserProfile, requireAuth } from '@/features/auth/server';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { dashboardOverviewQueryOptions } from '@/pages/dashboard/useDashboard';
import { getCurrentWeekRange } from '@/pages/dashboard/week';

export const Route = createFileRoute('/dashboard')({
  head: () => ({
    meta: [
      { title: 'Dashboard | JobApp' },
      { name: 'robots', content: 'noindex, nofollow' },
      {
        name: 'description',
        content: 'Keep your next step visible with a clear view of your applications and activity.',
      },
    ],
  }),
  loader: async ({ context }) => {
    const { userId } = await requireAuth();
    const profile = await getUserProfile();
    const { weekEnd, weekStart } = getCurrentWeekRange();
    await context.queryClient.ensureQueryData(dashboardOverviewQueryOptions(userId, weekStart, weekEnd));
    return { profile, userId, weekEnd, weekStart };
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  return <DashboardPage {...Route.useLoaderData()} />;
}
