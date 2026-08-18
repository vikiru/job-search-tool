import { Star } from 'lucide-react';

import type { InterestRating as InterestRatingValue } from '@/pages/applications/application-model';

function InterestRating({ value }: { value: InterestRatingValue | null }) {
  if (!value) {
    return <span className="font-mono text-caption text-muted-foreground">—</span>;
  }

  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-caption tabular-nums text-foreground"
      aria-label={`${value} out of 5 interest rating`}
    >
      <Star className="size-icon-xs fill-amber-400 text-amber-400" aria-hidden="true" />
      {value}/5
    </span>
  );
}

export { InterestRating };
