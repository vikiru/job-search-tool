import { useApplicationsTable } from '@/pages/applications/hooks/useApplicationsTable';
import { ApplicationsWorkspaceSection } from '@/pages/applications/sections/ApplicationsWorkspaceSection';

export function ApplicationsPage({
  search,
  userId,
}: {
  search: Parameters<typeof useApplicationsTable>[0];
  userId: string;
}) {
  const workspace = useApplicationsTable(search, userId);

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
          errorMessage={workspace.errorMessage}
          filteredApplications={workspace.filteredApplications}
          isLoading={workspace.applicationsQuery.isPending}
          interestFilter={search.interest}
          isFiltered={workspace.isFiltered}
          onClearFilters={workspace.onClearFilters}
          onInterestFilterChange={workspace.onInterestFilterChange}
          onPageChange={workspace.onPageChange}
          onPageSizeChange={workspace.onPageSizeChange}
          onSearchChange={workspace.onSearchChange}
          onSortingChange={workspace.handleSortingChange}
          onStatusFilterChange={workspace.onStatusFilterChange}
          onViewChange={workspace.onViewChange}
          pageIndex={workspace.pageIndex}
          pageSize={workspace.pageSize}
          search={workspace.search}
          searchFilteredApplications={workspace.searchFilteredApplications}
          sortDirection={workspace.sortDirection}
          sortKey={workspace.sortKey}
          statusFilter={workspace.statusFilter}
          view={workspace.view}
          userId={userId}
        />
      </div>
    </div>
  );
}
