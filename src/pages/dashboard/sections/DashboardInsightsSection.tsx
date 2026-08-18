import { ActivityTrend } from '@/pages/dashboard/components/ActivityTrend';
import { PipelineOverview } from '@/pages/dashboard/components/PipelineOverview';
import type { DashboardStatusCount, DashboardWeeklyActivity } from '@/server/db/queries/dashboard';

function DashboardInsightsSection({
  statusCounts,
  weekEnd,
  weekStart,
  weeklyActivity,
}: {
  statusCounts: DashboardStatusCount[];
  weekEnd: string;
  weekStart: string;
  weeklyActivity: DashboardWeeklyActivity[];
}) {
  return (
    <section aria-labelledby="dashboard-insights-title" className="grid min-w-0 gap-4 lg:grid-cols-2">
      <h2 id="dashboard-insights-title" className="sr-only">
        Search insights
      </h2>
      <PipelineOverview statusCounts={statusCounts} />
      <ActivityTrend weekEnd={weekEnd} weekStart={weekStart} weeklyActivity={weeklyActivity} />
    </section>
  );
}

export { DashboardInsightsSection };
