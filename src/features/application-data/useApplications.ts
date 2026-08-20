import { queryOptions, useQuery } from '@tanstack/react-query';

import type { ApplicationListItem } from '@/features/application-data/types';

import { applicationKeys } from '@/features/application-data/application-keys';
import { listApplications } from '@/features/application-data/server';
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
