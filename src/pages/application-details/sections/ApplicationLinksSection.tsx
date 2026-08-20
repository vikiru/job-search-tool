import type { SelectApplicationLink } from '@/server/db/zod';

import { ApplicationLinksCard } from '@/pages/applications/components/ApplicationLinksCard';

export function ApplicationLinksSection({
  applicationId,
  userId,
  links,
}: {
  applicationId: string;
  userId: string;
  links: SelectApplicationLink[];
}) {
  return <ApplicationLinksCard applicationId={applicationId} userId={userId} links={links} />;
}
