import { useMemo } from 'react';

import type { ApplicationRecord } from '@/entities/application/model';
import type { ApplicationsSearch } from '@/entities/application/search-params';

import { useApplicationsSearch } from '@/features/application-table/useApplicationsSearch';

export function useApplicationsFilter(applications: ApplicationRecord[], search: ApplicationsSearch) {
  const searchResultIds = useApplicationsSearch(applications, search.search);

  return useMemo(
    () =>
      applications.filter((application) => {
        const matchesSearch = !search.search.trim() || searchResultIds.has(application.id);
        const matchesStatus = search.status === 'ALL' || application.status === search.status;
        const matchesInterest = search.interest === 'ALL' || (application.interestRating ?? 0) >= search.interest;
        return matchesSearch && matchesStatus && matchesInterest;
      }),
    [applications, search.interest, search.search, search.status, searchResultIds],
  );
}
