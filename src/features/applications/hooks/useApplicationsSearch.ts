import { useMemo } from 'react';

import { createApplicationsSearchIndex, searchApplicationIds } from '@/features/applications/workspace/search-index';
import type { ApplicationRecord } from '@/pages/applications/application-model';

export function useApplicationsSearch(applications: ApplicationRecord[], query: string) {
  const searchIndex = useMemo(() => createApplicationsSearchIndex(applications), [applications]);

  return useMemo(() => searchApplicationIds(searchIndex, query), [query, searchIndex]);
}
