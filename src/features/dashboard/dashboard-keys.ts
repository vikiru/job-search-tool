export const dashboardKeys = {
  all: (userId: string) => ['user', userId, 'dashboard'] as const,
  stats: (userId: string) => [...dashboardKeys.all(userId), 'stats'] as const,
  statuses: (userId: string) => [...dashboardKeys.all(userId), 'statuses'] as const,
  weeklyActivity: (userId: string, weekStart: string) => [...dashboardKeys.all(userId), 'weekly', weekStart] as const,
  recentActivity: (userId: string) => [...dashboardKeys.all(userId), 'recent-activity'] as const,
};
