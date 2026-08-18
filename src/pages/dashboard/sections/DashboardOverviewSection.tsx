import { BriefcaseBusiness, CalendarDays, CircleCheck, Handshake } from 'lucide-react';

import type { DashboardStats } from '@/server/db/queries/dashboard';

import { KpiCard } from '@/pages/dashboard/components/KpiCard';

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
  ];
  return (
    <section aria-labelledby="dashboard-overview-title">
      <h2 id="dashboard-overview-title" className="sr-only">
        Search overview
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} value={String(metric.value)} />
        ))}
      </div>
    </section>
  );
}

export { DashboardOverviewSection };
