import { queryOptions, useQuery } from '@tanstack/react-query';

import type { RecentApplicationActivity } from '@/features/applications/types';
import type { DashboardStats, DashboardStatusCount, DashboardWeeklyActivity } from '@/server/db/queries/dashboard';

import { dashboardKeys } from '@/features/dashboard/dashboard-keys';
import {
  getDashboardStats,
  getDashboardRecentActivity,
  getDashboardStatusCounts,
  getDashboardWeeklyActivity,
} from '@/features/dashboard/server';
import { error, type Result } from '@/shared/lib/result';

export function dashboardStatsQueryOptions(userId: string) {
  return queryOptions<Result<DashboardStats>>({
    queryKey: dashboardKeys.stats(userId),
    queryFn: async () => {
      try {
        return await getDashboardStats();
      } catch {
        return error('We could not load your dashboard stats.');
      }
    },
  });
}

export function dashboardStatusQueryOptions(userId: string) {
  return queryOptions<Result<DashboardStatusCount[]>>({
    queryKey: dashboardKeys.statuses(userId),
    queryFn: async () => {
      try {
        return await getDashboardStatusCounts();
      } catch {
        return error('We could not load your application pipeline.');
      }
    },
  });
}

export function dashboardWeeklyActivityQueryOptions(userId: string, weekStart: string, weekEnd: string) {
  return queryOptions<Result<DashboardWeeklyActivity[]>>({
    queryKey: dashboardKeys.weeklyActivity(userId, weekStart),
    queryFn: async () => {
      try {
        return await getDashboardWeeklyActivity({ data: { weekStart, weekEnd } });
      } catch {
        return error('We could not load this week’s activity.');
      }
    },
  });
}

export function useDashboardStats(userId: string) {
  return useQuery(dashboardStatsQueryOptions(userId));
}

export function useDashboardStatusCounts(userId: string) {
  return useQuery(dashboardStatusQueryOptions(userId));
}

export function useDashboardWeeklyActivity(userId: string, weekStart: string, weekEnd: string) {
  return useQuery(dashboardWeeklyActivityQueryOptions(userId, weekStart, weekEnd));
}

export function dashboardRecentActivityQueryOptions(userId: string) {
  return queryOptions<Result<RecentApplicationActivity[]>>({
    queryKey: dashboardKeys.recentActivity(userId),
    queryFn: async () => {
      try {
        return await getDashboardRecentActivity();
      } catch {
        return error('We could not load recent activity.');
      }
    },
  });
}

export function useDashboardRecentActivity(userId: string) {
  return useQuery(dashboardRecentActivityQueryOptions(userId));
}
