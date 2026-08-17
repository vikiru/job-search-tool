import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';
import { ApplicationDetailPage } from '@/pages/applications/details/ApplicationDetailPage';
import { applications } from '@/pages/applications/data';

export const Route = createFileRoute('/applications/$id')({
  head: () => ({
    meta: [
      { title: 'Application | JobApp' },
      { name: 'description', content: 'Review the details, notes, links, and fit analysis for this application.' },
    ],
  }),
  beforeLoad: async () => await requireAuth(),
  component: ApplicationDetailRoute,
});

function ApplicationDetailRoute() {
  const { id } = Route.useParams();
  const application = applications.find((item) => item.id === id);

  if (!application) {
    return <p className="px-4 py-12 text-center text-muted-foreground">Application not found.</p>;
  }

  return <ApplicationDetailPage application={application} />;
}
