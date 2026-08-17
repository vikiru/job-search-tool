import { RecentActivity } from '@/pages/dashboard/components/RecentActivity';

function DashboardActivitySection() {
  return (
    <section aria-labelledby="dashboard-activity-title">
      <h2 id="dashboard-activity-title" className="sr-only">
        Recent search activity
      </h2>
      <RecentActivity />
    </section>
  );
}

export { DashboardActivitySection };
