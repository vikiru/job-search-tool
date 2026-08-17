import { ApplicationsEmptyState } from '@/pages/applications/components/ApplicationsEmptyState';
import { ApplicationsKanban } from '@/pages/applications/components/ApplicationsKanban';
import { ApplicationsPagination } from '@/pages/applications/components/ApplicationsPagination';
import { ApplicationsTable, type SortDirection, type SortKey } from '@/pages/applications/components/ApplicationsTable';
import { ApplicationsToolbar } from '@/pages/applications/components/ApplicationsToolbar';
import type { ApplicationRecord, ApplicationStatus, ApplicationView, InterestRating } from '@/pages/applications/data';
import { Card } from '@/shared/components/ui/card';

interface ApplicationsWorkspaceSectionProps {
  applications: ApplicationRecord[];
  filteredApplications: ApplicationRecord[];
  interestFilter: InterestRating | 'ALL';
  isFiltered: boolean;
  onClearFilters: () => void;
  onInterestFilterChange: (value: InterestRating | 'ALL') => void;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (value: string) => void;
  onSort: (key: SortKey) => void;
  onStatusFilterChange: (value: ApplicationStatus | 'ALL') => void;
  onViewChange: (value: ApplicationView) => void;
  pageIndex: number;
  pageSize: number;
  search: string;
  sortDirection: SortDirection;
  sortKey: SortKey;
  statusFilter: ApplicationStatus | 'ALL';
  view: ApplicationView;
}

export function ApplicationsWorkspaceSection({
  applications,
  filteredApplications,
  interestFilter,
  isFiltered,
  onClearFilters,
  onInterestFilterChange,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSort,
  onStatusFilterChange,
  onViewChange,
  pageIndex,
  pageSize,
  search,
  sortDirection,
  sortKey,
  statusFilter,
  view,
}: ApplicationsWorkspaceSectionProps) {
  const paginatedApplications = filteredApplications.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  return (
    <Card className="min-w-0 overflow-hidden">
      <ApplicationsToolbar
        search={search}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        interestFilter={interestFilter}
        onInterestFilterChange={onInterestFilterChange}
        view={view}
        onViewChange={onViewChange}
      />
      {filteredApplications.length === 0 ? (
        <ApplicationsEmptyState isFiltered={isFiltered} onClear={onClearFilters} />
      ) : view === 'table' ? (
        <>
          <ApplicationsTable
            applications={paginatedApplications}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <ApplicationsPagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            total={filteredApplications.length}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      ) : (
        <ApplicationsKanban applications={applications} />
      )}
    </Card>
  );
}
