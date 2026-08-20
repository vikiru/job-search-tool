import { useMemo } from 'react';

import type { ApplicationSortDirection, ApplicationSortKey } from '@/entities/application/search-params';

import { statusSortOrder, type ApplicationRecord } from '@/entities/application/model';

export function useApplicationsSort(
  applications: ApplicationRecord[],
  sortKey: ApplicationSortKey,
  direction: ApplicationSortDirection,
) {
  return useMemo(
    () =>
      applications.toSorted((first, second) => {
        const comparison =
          sortKey === 'status'
            ? statusSortOrder[first.status] - statusSortOrder[second.status]
            : String(first[sortKey] ?? '').localeCompare(String(second[sortKey] ?? ''), undefined, { numeric: true });
        return direction === 'asc' ? comparison : -comparison;
      }),
    [applications, direction, sortKey],
  );
}
