import { RecentActivity } from '@/pages/dashboard/components/RecentActivity';
import type { RecentApplicationActivity } from '@/features/applications/types';

function DashboardActivitySection({ activity }: { activity: RecentApplicationActivity[] }) {
  return (
    <section aria-labelledby="dashboard-activity-title">
      <h2 id="dashboard-activity-title" className="sr-only">
        Recent search activity
      </h2>
      <RecentActivity activity={activity} />
    </section>
  );
}

export { DashboardActivitySection };
