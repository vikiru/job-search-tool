import { BriefcaseBusiness, CalendarDays, CircleCheck, Handshake } from 'lucide-react';

import { KpiCard } from '@/pages/dashboard/components/KpiCard';

const metrics = [
  { label: 'Total applications', value: '42', detail: 'Across your search', icon: BriefcaseBusiness },
  {
    label: 'Active pipeline',
    value: '17',
    detail: 'Applied or further along',
    icon: CalendarDays,
    tone: 'positive' as const,
  },
  { label: 'Interviews', value: '4', detail: '2 scheduled this week', icon: CircleCheck, tone: 'positive' as const },
  { label: 'Offers', value: '1', detail: 'Currently open', icon: Handshake, tone: 'positive' as const },
];

function DashboardOverviewSection() {
  return (
    <section aria-labelledby="dashboard-overview-title">
      <h2 id="dashboard-overview-title" className="sr-only">
        Search overview
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} />
        ))}
      </div>
    </section>
  );
}

export { DashboardOverviewSection };
