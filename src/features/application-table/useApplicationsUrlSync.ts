import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';

import type { ApplicationsSearch } from '@/entities/application/search-params';

export function useApplicationsUrlSync(search: ApplicationsSearch, pageCount: number, hasApplications: boolean) {
  const navigate = useNavigate({ from: '/applications/' });

  const updateSearch = useCallback(
    (updates: Partial<ApplicationsSearch>) => {
      void navigate({ resetScroll: false, search: (previous) => ({ ...previous, ...updates }) });
    },
    [navigate],
  );

  useEffect(() => {
    if (hasApplications && search.page > pageCount) updateSearch({ page: pageCount });
  }, [hasApplications, pageCount, search.page, updateSearch]);

  return updateSearch;
}
