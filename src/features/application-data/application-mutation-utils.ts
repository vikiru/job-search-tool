import { useQueryClient } from '@tanstack/react-query';

import { applicationKeys } from '@/features/application-data/application-keys';
import { dashboardKeys } from '@/pages/dashboard/dashboard-keys';
import { error, type Result } from '@/shared/lib/result';

export async function withFallback<T>(operation: () => Promise<Result<T>>, message: string): Promise<Result<T>> {
  try {
    return await operation();
  } catch {
    return error(message);
  }
}

export function invalidateApplicationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
  id?: string,
) {
  void queryClient.invalidateQueries({ queryKey: applicationKeys.all(userId) });
  void queryClient.invalidateQueries({ queryKey: dashboardKeys.all(userId) });
  if (id) void queryClient.invalidateQueries({ queryKey: applicationKeys.detail(userId, id) });
}
