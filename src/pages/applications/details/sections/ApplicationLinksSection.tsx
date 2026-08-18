import { ApplicationLinksCard } from '@/pages/applications/components/ApplicationLinksCard';
import type { SelectApplicationLink } from '@/server/db/zod';

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
