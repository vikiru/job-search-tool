import { useNavigate } from '@tanstack/react-router';
import { functionalUpdate, type SortingState, type Updater } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo } from 'react';

import { useApplications } from '@/features/applications/hooks/useApplications';
import { useApplicationsSearch } from '@/features/applications/hooks/useApplicationsSearch';
import { statusSortOrder, toApplicationRecord, type ApplicationRecord } from '@/pages/applications/application-model';
import {
  applicationSortKeys,
  type ApplicationsSearch,
  type ApplicationSortDirection,
  type ApplicationSortKey,
} from '@/pages/applications/application-search-params';

function sortApplications(
  applications: ApplicationRecord[],
  sortKey: ApplicationSortKey,
  direction: ApplicationSortDirection,
) {
  return applications.toSorted((first, second) => {
    const comparison =
      sortKey === 'status'
        ? statusSortOrder[first.status] - statusSortOrder[second.status]
        : String(first[sortKey] ?? '').localeCompare(String(second[sortKey] ?? ''), undefined, { numeric: true });

    return direction === 'asc' ? comparison : -comparison;
  });
}

export function useApplicationsTable(search: ApplicationsSearch, userId: string) {
  const navigate = useNavigate({ from: '/applications/' });
  const applicationsQuery = useApplications(userId);
  const applicationsResult = applicationsQuery.data;
  const persistedApplications = useMemo(
    () => (applicationsResult?.success ? applicationsResult.data.map(toApplicationRecord) : []),
    [applicationsResult],
  );
  const searchResultIds = useApplicationsSearch(persistedApplications, search.search);
  const searchFilteredApplications = useMemo(
    () => persistedApplications.filter((application) => !search.search.trim() || searchResultIds.has(application.id)),
    [persistedApplications, search.search, searchResultIds],
  );
  const filteredApplications = useMemo(
    () =>
      sortApplications(
        searchFilteredApplications.filter((application) => {
          const matchesStatus = search.status === 'ALL' || application.status === search.status;
          const matchesInterest = search.interest === 'ALL' || (application.interestRating ?? 0) >= search.interest;
          return matchesStatus && matchesInterest;
        }),
        search.sort,
        search.direction,
      ),
    [search.direction, search.interest, search.sort, search.status, searchFilteredApplications],
  );
  const pageCount = Math.max(1, Math.ceil(filteredApplications.length / search.pageSize));
  const pageIndex = Math.min(search.page - 1, pageCount - 1);

  const updateSearch = useCallback(
    (updates: Partial<ApplicationsSearch>) => {
      void navigate({
        resetScroll: false,
        search: (previous) => ({ ...previous, ...updates }),
      });
    },
    [navigate],
  );

  function handleSortingChange(updater: Updater<SortingState>) {
    const currentSorting: SortingState = [{ id: search.sort, desc: search.direction === 'desc' }];
    const nextSorting = functionalUpdate(updater, currentSorting);
    const nextSort = nextSorting[0];

    if (!nextSort || !applicationSortKeys.includes(nextSort.id as ApplicationSortKey)) {
      updateSearch({ sort: 'applicationDate', direction: 'desc', page: 1 });
      return;
    }

    updateSearch({
      sort: nextSort.id as ApplicationSortKey,
      direction: nextSort.desc ? 'desc' : 'asc',
      page: 1,
    });
  }

  function clearFilters() {
    updateSearch({ search: '', status: 'ALL', interest: 'ALL', page: 1 });
  }

  useEffect(() => {
    if (applicationsResult?.success && search.page > pageCount) {
      updateSearch({ page: pageCount });
    }
  }, [applicationsResult?.success, pageCount, search.page, updateSearch]);

  return {
    applicationsQuery,
    errorMessage: applicationsResult && !applicationsResult.success ? applicationsResult.error : null,
    filteredApplications,
    handleSortingChange,
    isFiltered: Boolean(search.search.trim()) || search.status !== 'ALL' || search.interest !== 'ALL',
    onClearFilters: clearFilters,
    onInterestFilterChange: (interest: ApplicationsSearch['interest']) => updateSearch({ interest, page: 1 }),
    onPageChange: (nextPageIndex: number) => updateSearch({ page: nextPageIndex + 1 }),
    onPageSizeChange: (pageSize: number) =>
      updateSearch({ pageSize: pageSize === 5 || pageSize === 10 || pageSize === 25 ? pageSize : 10, page: 1 }),
    onSearchChange: (value: string) => updateSearch({ search: value, page: 1 }),
    onStatusFilterChange: (status: ApplicationsSearch['status']) => updateSearch({ status, page: 1 }),
    onViewChange: (view: ApplicationsSearch['view']) => updateSearch({ view }),
    pageIndex,
    pageSize: search.pageSize,
    search: search.search,
    searchFilteredApplications,
    sortDirection: search.direction,
    sortKey: search.sort,
    statusFilter: search.status,
    view: search.view,
  };
}
