import type { DashboardStats, DashboardStatusCount, DashboardWeeklyActivity } from '@/server/db/queries/dashboard';
import type { RecentApplicationActivity } from '@/features/applications/types';

export interface DashboardData {
  stats: DashboardStats;
  statusCounts: DashboardStatusCount[];
  weeklyActivity: DashboardWeeklyActivity[];
  recentActivity: RecentApplicationActivity[];
}
