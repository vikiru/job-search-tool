import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { format, parseISO } from 'date-fns';
import type { DashboardWeeklyActivity } from '@/server/db/queries/dashboard';

function ActivityTrend({
  weekEnd,
  weekStart,
  weeklyActivity,
}: {
  weekEnd: string;
  weekStart: string;
  weeklyActivity: DashboardWeeklyActivity[];
}) {
  const activity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${weekStart}T12:00:00`);
    date.setDate(date.getDate() + index);
    const dateValue = format(date, 'yyyy-MM-dd');
    const count = weeklyActivity.find((item) => item.applicationDate === dateValue)?.count ?? 0;
    return { dateValue, fullDay: format(date, 'EEEE'), label: format(date, 'EEE'), value: count };
  });
  const maxValue = Math.max(4, ...activity.map((day) => day.value));
  const yAxisLabels = [maxValue, Math.ceil(maxValue * 0.75), Math.ceil(maxValue * 0.5), Math.ceil(maxValue * 0.25), 0];

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle className="font-heading text-h4 font-semibold">Applications this week</CardTitle>
        <p className="mt-2 font-mono text-small font-medium leading-normal tracking-tight text-muted-foreground">
          {format(parseISO(weekStart), 'MMM d')} {'–'} {format(parseISO(weekEnd), 'MMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-4">
        <div
          className="grid min-h-0 min-w-0 flex-1 grid-cols-[1.75rem_minmax(0,1fr)] gap-2 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-3"
          role="img"
          aria-label={`Bar chart showing applications added from ${format(parseISO(weekStart), 'MMMM d')} through ${format(parseISO(weekEnd), 'MMMM d, yyyy')}`}
        >
          <div className="flex h-40 flex-col justify-between pb-6 text-right font-mono text-caption leading-none tabular-nums text-muted-foreground sm:h-56 lg:h-80">
            {yAxisLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div>
            <div className="relative h-32 border-b border-l border-border/70 sm:h-48 lg:h-72">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {yAxisLabels.slice(0, -1).map((label) => (
                  <span key={label} className="border-t border-border/50" />
                ))}
              </div>
              <div className="absolute inset-x-2 bottom-0 flex h-full items-end justify-between gap-1.5 sm:inset-x-3 sm:gap-4">
                {activity.map((day) => (
                  <div key={day.label} className="flex h-full min-w-0 flex-1 items-end justify-center">
                    <div
                      className="w-full max-w-6 rounded-t-md bg-primary/75 sm:max-w-8 lg:max-w-10"
                      style={{ height: `${(day.value / maxValue) * 100}%` }}
                      aria-label={`${day.fullDay}: ${day.value} applications`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex justify-between gap-1 px-1 font-mono text-caption leading-none text-muted-foreground sm:gap-2">
              {activity.map((day) => (
                <span key={day.label} className="min-w-0 flex-1 text-center">
                  {day.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { ActivityTrend };
