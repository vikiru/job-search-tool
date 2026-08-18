import { createFileRoute } from '@tanstack/react-router';

import { getUserProfile, requireAuth } from '@/features/auth/server';
import {
  dashboardRecentActivityQueryOptions,
  dashboardStatsQueryOptions,
  dashboardStatusQueryOptions,
  dashboardWeeklyActivityQueryOptions,
} from '@/features/dashboard/hooks/useDashboard';
import { getCurrentWeekRange } from '@/features/dashboard/week';
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
  loader: async ({ context }) => {
    const { userId } = await requireAuth();
    const profile = await getUserProfile();
    const { weekEnd, weekStart } = getCurrentWeekRange();
    await Promise.all([
      context.queryClient.ensureQueryData(dashboardStatsQueryOptions(userId)),
      context.queryClient.ensureQueryData(dashboardStatusQueryOptions(userId)),
      context.queryClient.ensureQueryData(dashboardWeeklyActivityQueryOptions(userId, weekStart, weekEnd)),
      context.queryClient.ensureQueryData(dashboardRecentActivityQueryOptions(userId)),
    ]);
    return { profile, userId, weekEnd, weekStart };
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  return <DashboardPage {...Route.useLoaderData()} />;
}
