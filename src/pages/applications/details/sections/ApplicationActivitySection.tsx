import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const activity = [
  { label: 'Application added', date: 'Aug 2, 2026' },
  { label: 'Status changed to Applied', date: 'Aug 3, 2026' },
];

export function ApplicationActivitySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-h4 font-semibold">Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activity.map((item, index) => (
          <div key={item.label} className="relative flex gap-3">
            <div className="relative flex w-3 shrink-0 justify-center">
              <span className="mt-1.5 size-2 rounded-full bg-primary" />
              {index < activity.length - 1 && <span className="absolute top-4 h-full w-px bg-border" />}
            </div>
            <div className="min-w-0">
              <p className="font-heading text-small font-medium">{item.label}</p>
              <time className="mt-1 block font-mono text-caption text-muted-foreground">{item.date}</time>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
