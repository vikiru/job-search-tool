import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const activity = [
  { label: 'Mon', fullDay: 'Monday', value: 1 },
  { label: 'Tue', fullDay: 'Tuesday', value: 3 },
  { label: 'Wed', fullDay: 'Wednesday', value: 2 },
  { label: 'Thu', fullDay: 'Thursday', value: 5 },
  { label: 'Fri', fullDay: 'Friday', value: 4 },
  { label: 'Sat', fullDay: 'Saturday', value: 2 },
  { label: 'Sun', fullDay: 'Sunday', value: 0 },
];

const yAxisLabels = [8, 6, 4, 2, 0];
const maxValue = 8;

function ActivityTrend() {
  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle className="font-heading text-h4 font-semibold">Applications this week</CardTitle>
        <p className="mt-1 font-mono text-small leading-normal tabular-nums text-muted-foreground">Aug 17–23, 2026</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-4">
        <div
          className="grid min-h-0 min-w-0 flex-1 grid-cols-[1.75rem_minmax(0,1fr)] gap-2 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-3"
          role="img"
          aria-label="Bar chart showing applications added from August 17 through August 23, 2026"
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
