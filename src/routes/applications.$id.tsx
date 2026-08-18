import { createFileRoute } from '@tanstack/react-router';

import { applicationDetailQueryOptions, useApplication } from '@/features/applications/hooks/useApplication';
import { requireAuth } from '@/features/auth/server';
import { ApplicationDetailPage } from '@/pages/applications/details/ApplicationDetailPage';

export const Route = createFileRoute('/applications/$id')({
  head: () => ({
    meta: [
      { title: 'Application | JobApp' },
      { name: 'description', content: 'Review the details, notes, links, and fit analysis for this application.' },
    ],
  }),
  loader: async ({ context, params }) => {
    const { userId } = await requireAuth();
    const application = await context.queryClient.ensureQueryData(applicationDetailQueryOptions(userId, params.id));
    return { application, userId };
  },
  component: ApplicationDetailRoute,
});

function ApplicationDetailRoute() {
  const { id } = Route.useParams();
  const { application: loaderApplication, userId } = Route.useLoaderData();
  const { data } = useApplication(userId, id);
  const application = data ?? loaderApplication;

  if (!application.success) {
    return <p className="px-4 py-12 text-center text-muted-foreground">Application not found.</p>;
  }

  return <ApplicationDetailPage application={application.data} userId={userId} />;
}
