import { useMemo } from 'react';

import type { ApplicationRecord } from '@/entities/application/model';

import { createApplicationsSearchIndex, searchApplicationIds } from '@/features/application-table/search-index';

export function useApplicationsSearch(applications: ApplicationRecord[], query: string) {
  const searchIndex = useMemo(() => createApplicationsSearchIndex(applications), [applications]);

  return useMemo(() => searchApplicationIds(searchIndex, query), [query, searchIndex]);
}
