import { Search } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';

interface ApplicationsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ApplicationsSearchBar({ onChange, value }: ApplicationsSearchBarProps) {
  return (
    <div className="relative min-w-0 flex-1 lg:max-w-xl">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-icon-sm -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        className="h-10 pl-9 text-base sm:text-small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by company or role"
        aria-label="Search applications"
      />
    </div>
  );
}
