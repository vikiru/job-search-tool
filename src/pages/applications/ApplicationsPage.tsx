import { ApplicationsWorkspaceSection } from '@/pages/applications/sections/ApplicationsWorkspaceSection';
import { useApplicationsTable } from '@/pages/applications/useApplicationsTable';

export function ApplicationsPage({
  search,
  userId,
}: {
  search: Parameters<typeof useApplicationsTable>[0];
  userId: string;
}) {
  const workspace = useApplicationsTable(search, userId);

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-6 sm:space-y-8">
        <header className="border-b border-border/70 pb-6 sm:pb-8">
          <h1 className="font-heading text-h1 leading-tight font-semibold tracking-tight">Applications</h1>
          <p className="mt-3 max-w-2xl text-p leading-relaxed text-pretty text-muted-foreground">
            Keep every opportunity, decision, and next step in view as your search moves forward.
          </p>
        </header>

        <ApplicationsWorkspaceSection
          workspace={workspace}
          isLoading={workspace.applicationsQuery.isPending}
          interestFilter={search.interest}
          userId={userId}
        />
      </div>
    </div>
  );
}
