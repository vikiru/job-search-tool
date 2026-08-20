import { queryOptions, useQuery } from '@tanstack/react-query';

import type { ApplicationDetail } from '@/features/application-data/types';

import { applicationKeys } from '@/features/application-data/application-keys';
import { getApplication } from '@/features/application-data/server';
import { error, type Result } from '@/shared/lib/result';

export function applicationDetailQueryOptions(userId: string, id: string) {
  return queryOptions<Result<ApplicationDetail>>({
    queryKey: applicationKeys.detail(userId, id),
    queryFn: async () => {
      try {
        return await getApplication({ data: { id } });
      } catch {
        return error('We could not load this application.');
      }
    },
  });
}

export function useApplication(userId: string, id: string) {
  return useQuery(applicationDetailQueryOptions(userId, id));
}
