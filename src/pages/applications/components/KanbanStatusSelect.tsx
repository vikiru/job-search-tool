import { formatStatus, type ApplicationStatus } from '@/entities/application/model';
import { isApplicationStatus } from '@/entities/application/search-params';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface KanbanStatusSelectProps {
  onChange: (status: ApplicationStatus) => void;
  statuses: readonly ApplicationStatus[];
  value: ApplicationStatus;
}

export function KanbanStatusSelect({ onChange, statuses, value }: KanbanStatusSelectProps) {
  return (
    <div onPointerDown={(event) => event.stopPropagation()}>
      <Select value={value} onValueChange={(nextValue) => isApplicationStatus(nextValue) && onChange(nextValue)}>
        <SelectTrigger
          className="h-7 max-w-full min-w-0 gap-1 rounded-full border-border/70 bg-muted/50 px-2 text-caption font-medium"
          aria-label={`Change status from ${formatStatus(value)}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="min-w-40 p-1.5">
          {statuses.map((status) => (
            <SelectItem key={status} value={status} className="py-2 font-heading text-small">
              {formatStatus(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
