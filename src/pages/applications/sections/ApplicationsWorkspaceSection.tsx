import { ApplicationsEmptyState } from '@/pages/applications/components/ApplicationsEmptyState';
import { ApplicationsKanban } from '@/pages/applications/components/ApplicationsKanban';
import { ApplicationsPagination } from '@/pages/applications/components/ApplicationsPagination';
import { ApplicationsTable, type SortDirection, type SortKey } from '@/pages/applications/components/ApplicationsTable';
import { ApplicationsToolbar } from '@/pages/applications/components/ApplicationsToolbar';
import { KanbanSkeleton } from '@/pages/applications/components/KanbanSkeleton';
import type { ApplicationRecord, ApplicationStatus, ApplicationView, InterestRating } from '@/pages/applications/data';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Loader } from '@/shared/components/ui/Loader';

interface ApplicationsWorkspaceSectionProps {
  errorMessage: string | null;
  filteredApplications: ApplicationRecord[];
  isLoading: boolean;
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
  userId: string;
}

export function ApplicationsWorkspaceSection({
  errorMessage,
  filteredApplications,
  isLoading,
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
  userId,
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
        userId={userId}
      />
      {isLoading ? (
        view === 'kanban' ? (
          <KanbanSkeleton />
        ) : (
          <Loader label="Loading applications" />
        )
      ) : errorMessage ? (
        <CardContent className="p-4 sm:p-6">
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-small text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        </CardContent>
      ) : filteredApplications.length === 0 ? (
        <ApplicationsEmptyState isFiltered={isFiltered} onClear={onClearFilters} userId={userId} />
      ) : view === 'table' ? (
        <>
          <ApplicationsTable
            applications={paginatedApplications}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={onSort}
            userId={userId}
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
        <ApplicationsKanban applications={filteredApplications} userId={userId} />
      )}
    </Card>
  );
}
