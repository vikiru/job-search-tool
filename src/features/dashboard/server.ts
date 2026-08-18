import { createServerFn } from '@tanstack/react-start';
import { auth } from '@clerk/tanstack-react-start/server';
import { z } from 'zod';

import {
  findDashboardStats,
  findDashboardStatusCounts,
  findDashboardWeeklyActivity,
} from '@/server/db/queries/dashboard';
import { DASHBOARD_RECENT_ACTIVITY_LIMIT, findRecentApplicationActivity } from '@/server/db/queries/activity';
import { error, success, type Result } from '@/shared/lib/result';
import type { DashboardStats, DashboardStatusCount, DashboardWeeklyActivity } from '@/server/db/queries/dashboard';
import type { RecentApplicationActivity } from '@/features/applications/types';

const weekSchema = z.object({ weekStart: z.string().date(), weekEnd: z.string().date() });

async function getUserId() {
  return (await auth()).userId;
}

export const getDashboardStats = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Result<DashboardStats>> => {
    try {
      const userId = await getUserId();
      if (!userId) return error('Unauthorized');
      return success(await findDashboardStats(userId));
    } catch {
      return error('We could not load your dashboard stats.');
    }
  },
);

export const getDashboardStatusCounts = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Result<DashboardStatusCount[]>> => {
    try {
      const userId = await getUserId();
      if (!userId) return error('Unauthorized');
      return success(await findDashboardStatusCounts(userId));
    } catch {
      return error('We could not load your application pipeline.');
    }
  },
);

export const getDashboardWeeklyActivity = createServerFn({ method: 'GET' })
  .validator((input: unknown) => weekSchema.parse(input))
  .handler(async ({ data }): Promise<Result<DashboardWeeklyActivity[]>> => {
    try {
      const userId = await getUserId();
      if (!userId) return error('Unauthorized');
      return success(await findDashboardWeeklyActivity(userId, data.weekStart, data.weekEnd));
    } catch {
      return error('We could not load this week’s activity.');
    }
  });

export const getDashboardRecentActivity = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Result<RecentApplicationActivity[]>> => {
    try {
      const userId = await getUserId();
      if (!userId) return error('Unauthorized');
      return success(await findRecentApplicationActivity(userId, DASHBOARD_RECENT_ACTIVITY_LIMIT));
    } catch {
      return error('We could not load recent activity.');
    }
  },
);
