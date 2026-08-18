import { useUser } from '@clerk/tanstack-react-start';

import {
  useDashboardRecentActivity,
  useDashboardStats,
  useDashboardStatusCounts,
  useDashboardWeeklyActivity,
} from '@/features/dashboard/hooks/useDashboard';
import { DashboardEmptyState } from '@/pages/dashboard/components/DashboardEmptyState';
import { DashboardErrorState } from '@/pages/dashboard/components/DashboardErrorState';
import { DashboardActivitySection } from '@/pages/dashboard/sections/DashboardActivitySection';
import { DashboardInsightsSection } from '@/pages/dashboard/sections/DashboardInsightsSection';
import { DashboardOverviewSection } from '@/pages/dashboard/sections/DashboardOverviewSection';
import { Loader } from '@/shared/components/ui/Loader';

function DashboardPage({
  profile,
  userId,
  weekEnd,
  weekStart,
}: {
  profile: { firstName: string | null; lastName: string | null } | null;
  userId: string;
  weekEnd: string;
  weekStart: string;
}) {
  const { user } = useUser();
  const statsQuery = useDashboardStats(userId);
  const statusQuery = useDashboardStatusCounts(userId);
  const weeklyActivityQuery = useDashboardWeeklyActivity(userId, weekStart, weekEnd);
  const recentActivityQuery = useDashboardRecentActivity(userId);
  const queries = [statsQuery, statusQuery, weeklyActivityQuery, recentActivityQuery];
  const isLoading = queries.some((query) => query.isPending);
  const failedQuery = queries.find((query) => query.data && !query.data.success);
  const stats = statsQuery.data?.success ? statsQuery.data.data : null;
  const userName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
    (user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username : null) ||
    'there';

  return (
    <div className="mx-auto max-w-[var(--breakpoint-2xl)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-8">
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-full min-w-0">
            <h1 className="font-heading text-h1 leading-tight font-semibold tracking-tight text-balance">
              Welcome back, {userName}.
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-pretty text-muted-foreground">
              A clear view of your applications, progress, and the work that needs your attention.
            </p>
          </div>
        </header>

        {isLoading ? (
          <Loader label="Loading dashboard" />
        ) : failedQuery?.data && !failedQuery.data.success ? (
          <DashboardErrorState message={failedQuery.data.error} />
        ) : stats?.total === 0 ? (
          <DashboardEmptyState />
        ) : (
          <>
            <DashboardOverviewSection stats={stats} />
            <DashboardInsightsSection
              statusCounts={statusQuery.data?.success ? statusQuery.data.data : []}
              weekEnd={weekEnd}
              weekStart={weekStart}
              weeklyActivity={weeklyActivityQuery.data?.success ? weeklyActivityQuery.data.data : []}
            />
            <DashboardActivitySection
              activity={recentActivityQuery.data?.success ? recentActivityQuery.data.data : []}
            />
          </>
        )}
      </div>
    </div>
  );
}

export { DashboardPage };
