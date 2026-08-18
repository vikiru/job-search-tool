import { useEffect, useMemo, useState } from 'react';

import { useApplications } from '@/features/applications/hooks/useApplications';
import { useApplicationsSearch } from '@/features/applications/hooks/useApplicationsSearch';
import type { SortDirection, SortKey } from '@/pages/applications/components/ApplicationsTable';
import {
  toApplicationRecord,
  statusSortOrder,
  type ApplicationStatus,
  type ApplicationView,
  type InterestRating,
} from '@/pages/applications/data';
import { ApplicationsWorkspaceSection } from '@/pages/applications/sections/ApplicationsWorkspaceSection';

export function ApplicationsPage({ userId }: { userId: string }) {
  const applicationsQuery = useApplications(userId);
  const applicationsResult = applicationsQuery.data;
  const persistedApplications = useMemo(
    () => (applicationsResult?.success ? applicationsResult.data.map(toApplicationRecord) : []),
    [applicationsResult],
  );
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [interestFilter, setInterestFilter] = useState<InterestRating | 'ALL'>('ALL');
  const [view, setView] = useState<ApplicationView>('table');
  const [sortKey, setSortKey] = useState<SortKey>('applicationDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const searchResultIds = useApplicationsSearch(persistedApplications, search);

  const filteredApplications = useMemo(() => {
    const filtered = persistedApplications.filter((application) => {
      const matchesStatus = statusFilter === 'ALL' || application.status === statusFilter;
      const matchesInterest = interestFilter === 'ALL' || (application.interestRating ?? 0) >= interestFilter;
      const matchesSearch = !search.trim() || searchResultIds.has(application.id);
      return matchesStatus && matchesInterest && matchesSearch;
    });

    return [...filtered].sort((first, second) => {
      if (sortKey === 'status') {
        const comparison = statusSortOrder[first.status] - statusSortOrder[second.status];
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      const firstValue = first[sortKey] ?? '';
      const secondValue = second[sortKey] ?? '';
      const comparison = String(firstValue).localeCompare(String(secondValue), undefined, { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [interestFilter, persistedApplications, search, searchResultIds, sortDirection, sortKey, statusFilter]);

  useEffect(() => {
    setPageIndex(0);
  }, [interestFilter, search, sortDirection, sortKey, statusFilter]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setInterestFilter('ALL');
  };

  const isFiltered = Boolean(search.trim()) || statusFilter !== 'ALL' || interestFilter !== 'ALL';

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPageIndex(0);
  };

  return (
    <div className="mx-auto max-w-[var(--breakpoint-2xl)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-6 sm:space-y-8">
        <header className="border-b border-border/70 pb-6 sm:pb-8">
          <h1 className="font-heading text-h1 font-semibold leading-tight tracking-tight">Applications</h1>
          <p className="mt-3 max-w-2xl text-p leading-relaxed text-pretty text-muted-foreground">
            Keep every opportunity, decision, and next step in view as your search moves forward.
          </p>
        </header>

        {applicationsResult && !applicationsResult.success ? (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-small text-destructive"
            role="alert"
          >
            {applicationsResult.error}
          </p>
        ) : null}
        <ApplicationsWorkspaceSection
          applications={filteredApplications}
          filteredApplications={filteredApplications}
          interestFilter={interestFilter}
          isFiltered={isFiltered}
          onClearFilters={clearFilters}
          onInterestFilterChange={setInterestFilter}
          onPageChange={setPageIndex}
          onPageSizeChange={handlePageSizeChange}
          onSearchChange={setSearch}
          onSort={handleSort}
          onStatusFilterChange={setStatusFilter}
          onViewChange={setView}
          pageIndex={pageIndex}
          pageSize={pageSize}
          search={search}
          sortDirection={sortDirection}
          sortKey={sortKey}
          statusFilter={statusFilter}
          view={view}
          userId={userId}
        />
      </div>
    </div>
  );
}
