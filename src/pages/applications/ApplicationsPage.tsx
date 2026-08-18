import { useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { functionalUpdate, type SortingState, type Updater } from '@tanstack/react-table';

import { useApplications } from '@/features/applications/hooks/useApplications';
import { useApplicationsSearch } from '@/features/applications/hooks/useApplicationsSearch';
import {
  applicationSortKeys,
  type ApplicationsSearch,
  type ApplicationSortDirection,
  type ApplicationSortKey,
} from '@/pages/applications/application-search-params';
import { statusSortOrder, toApplicationRecord, type ApplicationRecord } from '@/pages/applications/data';
import { ApplicationsWorkspaceSection } from '@/pages/applications/sections/ApplicationsWorkspaceSection';

function sortApplications(
  applications: ApplicationRecord[],
  sortKey: ApplicationSortKey,
  direction: ApplicationSortDirection,
) {
  return [...applications].sort((first, second) => {
    const comparison =
      sortKey === 'status'
        ? statusSortOrder[first.status] - statusSortOrder[second.status]
        : String(first[sortKey] ?? '').localeCompare(String(second[sortKey] ?? ''), undefined, { numeric: true });

    return direction === 'asc' ? comparison : -comparison;
  });
}

export function ApplicationsPage({ search, userId }: { search: ApplicationsSearch; userId: string }) {
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

  const updateSearch = (updates: Partial<ApplicationsSearch>) => {
    void navigate({
      resetScroll: false,
      search: (previous) => ({ ...previous, ...updates }),
    });
  };

  const handleSortingChange = (updater: Updater<SortingState>) => {
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
  };

  const clearFilters = () => updateSearch({ search: '', status: 'ALL', interest: 'ALL', page: 1 });
  const isFiltered = Boolean(search.search.trim()) || search.status !== 'ALL' || search.interest !== 'ALL';

  useEffect(() => {
    if (applicationsResult?.success && search.page > pageCount) {
      updateSearch({ page: pageCount });
    }
  }, [applicationsResult?.success, pageCount, search.page]);

  return (
    <div className="mx-auto max-w-[var(--breakpoint-2xl)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-6 sm:space-y-8">
        <header className="border-b border-border/70 pb-6 sm:pb-8">
          <h1 className="font-heading text-h1 font-semibold leading-tight tracking-tight">Applications</h1>
          <p className="mt-3 max-w-2xl text-p leading-relaxed text-pretty text-muted-foreground">
            Keep every opportunity, decision, and next step in view as your search moves forward.
          </p>
        </header>

        <ApplicationsWorkspaceSection
          errorMessage={applicationsResult && !applicationsResult.success ? applicationsResult.error : null}
          filteredApplications={filteredApplications}
          isLoading={applicationsQuery.isPending}
          interestFilter={search.interest}
          isFiltered={isFiltered}
          onClearFilters={clearFilters}
          onInterestFilterChange={(interest) => updateSearch({ interest, page: 1 })}
          onPageChange={(nextPageIndex) => updateSearch({ page: nextPageIndex + 1 })}
          onPageSizeChange={(pageSize) =>
            updateSearch({ pageSize: pageSize === 5 || pageSize === 10 || pageSize === 25 ? pageSize : 10, page: 1 })
          }
          onSearchChange={(value) => updateSearch({ search: value, page: 1 })}
          onSortingChange={handleSortingChange}
          onStatusFilterChange={(status) => updateSearch({ status, page: 1 })}
          onViewChange={(view) => updateSearch({ view })}
          pageIndex={pageIndex}
          pageSize={search.pageSize}
          search={search.search}
          searchFilteredApplications={searchFilteredApplications}
          sortDirection={search.direction}
          sortKey={search.sort}
          statusFilter={search.status}
          view={search.view}
          userId={userId}
        />
      </div>
    </div>
  );
}
