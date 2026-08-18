import { Ban, BriefcaseBusiness, CalendarDays, CircleCheck, CircleX, Handshake, Percent } from 'lucide-react';

import { KpiCard } from '@/pages/dashboard/components/KpiCard';
import type { DashboardStats } from '@/server/db/queries/dashboard';

function DashboardOverviewSection({ stats }: { stats: DashboardStats | null }) {
  const metrics = [
    { label: 'Total applications', value: stats?.total ?? 0, detail: 'Across your search', icon: BriefcaseBusiness },
    {
      label: 'Active pipeline',
      value: stats?.activePipeline ?? 0,
      detail: 'Applied or further along',
      icon: CalendarDays,
      tone: 'positive' as const,
    },
    {
      label: 'Interviews',
      value: stats?.interviews ?? 0,
      detail: 'In your pipeline',
      icon: CircleCheck,
      tone: 'positive' as const,
    },
    {
      label: 'Offers',
      value: stats?.offers ?? 0,
      detail: 'Currently open',
      icon: Handshake,
      tone: 'positive' as const,
    },
    { label: 'Rejected', value: stats?.rejected ?? 0, detail: 'Closed applications', icon: CircleX },
    {
      label: 'Response rate',
      value: `${stats?.responseRate ?? 0}%`,
      detail: 'Reached screening or beyond',
      icon: Percent,
      tone: 'positive' as const,
    },
    { label: 'Ghosted', value: stats?.ghosted ?? 0, detail: 'No response recorded', icon: Ban },
  ];
  return (
    <section aria-labelledby="dashboard-overview-title">
      <h2 id="dashboard-overview-title" className="sr-only">
        Search overview
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} value={String(metric.value)} />
        ))}
      </div>
    </section>
  );
}

export { DashboardOverviewSection };
