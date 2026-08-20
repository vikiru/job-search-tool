import { queryOptions, useQuery } from '@tanstack/react-query';

import { dashboardKeys } from '@/pages/dashboard/dashboard-keys';
import { getDashboardOverview } from '@/pages/dashboard/server';
import { error } from '@/shared/lib/result';

export function dashboardOverviewQueryOptions(userId: string, weekStart: string, weekEnd: string) {
  return queryOptions({
    queryKey: [...dashboardKeys.all(userId), 'overview', weekStart, weekEnd] as const,
    queryFn: async () => {
      try {
        return await getDashboardOverview({ data: { weekStart, weekEnd } });
      } catch {
        return error('We could not load your dashboard overview.');
      }
    },
  });
}

export function useDashboardOverview(userId: string, weekStart: string, weekEnd: string) {
  return useQuery(dashboardOverviewQueryOptions(userId, weekStart, weekEnd));
}
