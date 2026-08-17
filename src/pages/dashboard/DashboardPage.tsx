import { useUser } from '@clerk/tanstack-react-start';

import { DashboardActivitySection } from '@/pages/dashboard/sections/DashboardActivitySection';
import { DashboardInsightsSection } from '@/pages/dashboard/sections/DashboardInsightsSection';
import { DashboardOverviewSection } from '@/pages/dashboard/sections/DashboardOverviewSection';

function DashboardPage() {
  const { user } = useUser();
  const userName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'there'
    : 'there';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-8">
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <h1 className="font-heading text-h1 font-semibold leading-tight tracking-tight text-balance">
              Welcome back, {userName}.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">
              A clear view of your applications, progress, and the work that needs your attention.
            </p>
          </div>
        </header>

        <DashboardOverviewSection />
        <DashboardInsightsSection />
        <DashboardActivitySection />
      </div>
    </div>
  );
}

export { DashboardPage };
