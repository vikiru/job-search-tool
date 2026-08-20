import { functionalUpdate, type SortingState, type Updater } from '@tanstack/react-table';
import { useMemo } from 'react';

import { toApplicationRecord } from '@/entities/application/model';
import { isApplicationSortKey, type ApplicationsSearch } from '@/entities/application/search-params';
import { useApplications } from '@/features/application-data/useApplications';
import { useApplicationsFilter } from '@/features/application-table/useApplicationsFilter';
import { useApplicationsSort } from '@/features/application-table/useApplicationsSort';
import { useApplicationsUrlSync } from '@/features/application-table/useApplicationsUrlSync';

export function useApplicationsTable(search: ApplicationsSearch, userId: string) {
  const applicationsQuery = useApplications(userId);
  const applicationsResult = applicationsQuery.data;
  const persistedApplications = useMemo(
    () => (applicationsResult?.success ? applicationsResult.data.map(toApplicationRecord) : []),
    [applicationsResult],
  );
  const searchFilteredApplications = useApplicationsFilter(persistedApplications, search);
  const filteredApplications = useApplicationsSort(searchFilteredApplications, search.sort, search.direction);
  const pageCount = Math.max(1, Math.ceil(filteredApplications.length / search.pageSize));
  const pageIndex = Math.min(search.page - 1, pageCount - 1);
  const updateSearch = useApplicationsUrlSync(search, pageCount, Boolean(applicationsResult?.success));

  function handleSortingChange(updater: Updater<SortingState>) {
    const currentSorting: SortingState = [{ id: search.sort, desc: search.direction === 'desc' }];
    const nextSorting = functionalUpdate(updater, currentSorting);
    const nextSort = nextSorting[0];

    if (!nextSort || !isApplicationSortKey(nextSort.id)) {
      updateSearch({ sort: 'applicationDate', direction: 'desc', page: 1 });
      return;
    }

    updateSearch({
      sort: nextSort.id,
      direction: nextSort.desc ? 'desc' : 'asc',
      page: 1,
    });
  }

  function clearFilters() {
    updateSearch({ search: '', status: 'ALL', interest: 'ALL', page: 1 });
  }

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
