import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';

import { listApplications } from '@/features/applications/server';
import type { ApplicationListItem } from '@/features/applications/types';
import { error, type Result } from '@/shared/lib/result';

export const applicationKeys = {
  all: (userId: string) => ['user', userId, 'applications'] as const,
  detail: (userId: string, id: string) => ['user', userId, 'applications', id] as const,
};

export function applicationsQueryOptions(userId: string) {
  return queryOptions<Result<ApplicationListItem[]>>({
    queryKey: applicationKeys.all(userId),
    queryFn: async () => {
      try {
        return await listApplications();
      } catch {
        return error('We could not load your applications.');
      }
    },
  });
}

export function useApplications(userId: string) {
  return useQuery(applicationsQueryOptions(userId));
}

export function useInvalidateApplications(userId: string) {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: applicationKeys.all(userId) });
}
