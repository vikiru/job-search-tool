import { useEffect, useMemo, useState } from 'react';

import { ApplicationsKanban } from '@/pages/applications/components/ApplicationsKanban';
import { ApplicationsEmptyState } from '@/pages/applications/components/ApplicationsEmptyState';
import { ApplicationsPagination } from '@/pages/applications/components/ApplicationsPagination';
import { ApplicationsTable, type SortDirection, type SortKey } from '@/pages/applications/components/ApplicationsTable';
import { ApplicationsToolbar } from '@/pages/applications/components/ApplicationsToolbar';
import {
  applications as sampleApplications,
  statusSortOrder,
  type ApplicationStatus,
  type ApplicationView,
  type InterestRating,
} from '@/pages/applications/data';
import { Card } from '@/shared/components/ui/card';

function ApplicationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [interestFilter, setInterestFilter] = useState<InterestRating | 'ALL'>('ALL');
  const [view, setView] = useState<ApplicationView>('table');
  const [sortKey, setSortKey] = useState<SortKey>('applicationDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = sampleApplications.filter((application) => {
      const matchesStatus = statusFilter === 'ALL' || application.status === statusFilter;
      const matchesInterest = interestFilter === 'ALL' || (application.interestRating ?? 0) >= interestFilter;
      const searchableText = [
        application.company,
        application.position,
        application.location,
        ...application.technologies,
      ]
        .join(' ')
        .toLowerCase();
      return matchesStatus && matchesInterest && (!normalizedSearch || searchableText.includes(normalizedSearch));
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
  }, [interestFilter, search, sortDirection, sortKey, statusFilter]);

  useEffect(() => {
    setPageIndex(0);
  }, [interestFilter, search, sortDirection, sortKey, statusFilter]);

  const paginatedApplications = filteredApplications.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

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

        <Card className="min-w-0 overflow-hidden">
          <ApplicationsToolbar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            interestFilter={interestFilter}
            onInterestFilterChange={setInterestFilter}
            view={view}
            onViewChange={setView}
          />
          {filteredApplications.length === 0 ? (
            <ApplicationsEmptyState isFiltered={isFiltered} onClear={clearFilters} />
          ) : view === 'table' ? (
            <>
              <ApplicationsTable
                applications={paginatedApplications}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <ApplicationsPagination
                pageIndex={pageIndex}
                pageSize={pageSize}
                total={filteredApplications.length}
                onPageChange={setPageIndex}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          ) : (
            <ApplicationsKanban applications={filteredApplications} />
          )}
        </Card>
      </div>
    </div>
  );
}

export { ApplicationsPage };
