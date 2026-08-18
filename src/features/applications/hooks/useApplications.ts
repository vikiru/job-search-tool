import { queryOptions, useQuery } from '@tanstack/react-query';

import { listApplications } from '@/features/applications/server';
import type { ApplicationListItem } from '@/features/applications/types';
import { applicationKeys } from '@/features/applications/application-keys';
import { error, type Result } from '@/shared/lib/result';

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
