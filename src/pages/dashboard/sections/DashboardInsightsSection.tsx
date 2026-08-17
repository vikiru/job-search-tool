import { ActivityTrend } from '@/pages/dashboard/components/ActivityTrend';
import { PipelineOverview } from '@/pages/dashboard/components/PipelineOverview';

function DashboardInsightsSection() {
  return (
    <section aria-labelledby="dashboard-insights-title" className="grid min-w-0 gap-4 lg:grid-cols-2">
      <h2 id="dashboard-insights-title" className="sr-only">
        Search insights
      </h2>
      <PipelineOverview />
      <ActivityTrend />
    </section>
  );
}

export { DashboardInsightsSection };
