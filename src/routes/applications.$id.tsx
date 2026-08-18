import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';
import { applicationDetailQueryOptions, useApplication } from '@/features/applications/hooks/useApplication';
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
    await context.queryClient.ensureQueryData(applicationDetailQueryOptions(userId, params.id));
    return { userId };
  },
  component: ApplicationDetailRoute,
});

function ApplicationDetailRoute() {
  const { id } = Route.useParams();
  const { userId } = Route.useLoaderData();
  const { data } = useApplication(userId, id);

  if (!data?.success) {
    return <p className="px-4 py-12 text-center text-muted-foreground">Application not found.</p>;
  }

  return <ApplicationDetailPage application={data.data} userId={userId} />;
}
