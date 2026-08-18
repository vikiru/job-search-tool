import type { RecentApplicationActivity } from '@/features/applications/types';
import type { DashboardStats, DashboardStatusCount, DashboardWeeklyActivity } from '@/server/db/queries/dashboard';

export interface DashboardData {
  stats: DashboardStats;
  statusCounts: DashboardStatusCount[];
  weeklyActivity: DashboardWeeklyActivity[];
  recentActivity: RecentApplicationActivity[];
}
