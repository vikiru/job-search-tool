export const dashboardKeys = {
  all: (userId: string) => ['user', userId, 'dashboard'] as const,
};
