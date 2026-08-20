import type { InterestRating } from '@/entities/application/model';
import type { useApplicationsTable } from '@/pages/applications/useApplicationsTable';

import { ApplicationsEmptyState } from '@/pages/applications/components/ApplicationsEmptyState';
import { ApplicationsKanban } from '@/pages/applications/components/ApplicationsKanban';
import { ApplicationsPagination } from '@/pages/applications/components/ApplicationsPagination';
import { ApplicationsTable } from '@/pages/applications/components/ApplicationsTable';
import { ApplicationsToolbar } from '@/pages/applications/components/ApplicationsToolbar';
import { KanbanSkeleton } from '@/pages/applications/components/KanbanSkeleton';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Loader } from '@/shared/components/ui/loader';

interface ApplicationsWorkspaceSectionProps {
  workspace: ReturnType<typeof useApplicationsTable>;
  isLoading: boolean;
  interestFilter: InterestRating | 'ALL';
  userId: string;
}

export function ApplicationsWorkspaceSection({
  workspace,
  isLoading,
  interestFilter,
  userId,
}: ApplicationsWorkspaceSectionProps) {
  const {
    errorMessage,
    filteredApplications,
    handleSortingChange,
    isFiltered,
    onClearFilters,
    onInterestFilterChange,
    onPageChange,
    onPageSizeChange,
    onSearchChange,
    onStatusFilterChange,
    onViewChange,
    pageIndex,
    pageSize,
    search,
    searchFilteredApplications,
    sortDirection,
    sortKey,
    statusFilter,
    view,
  } = workspace;
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
            applications={searchFilteredApplications}
            columnFilters={[
              ...(statusFilter === 'ALL' ? [] : [{ id: 'status', value: statusFilter }]),
              ...(interestFilter === 'ALL' ? [] : [{ id: 'interestRating', value: interestFilter }]),
            ]}
            onSortingChange={handleSortingChange}
            pagination={{ pageIndex, pageSize }}
            sorting={[{ id: sortKey, desc: sortDirection === 'desc' }]}
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
