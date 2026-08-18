import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';
import { applicationsQueryOptions } from '@/features/applications/hooks/useApplications';
import { ApplicationsPage } from '@/pages/applications/ApplicationsPage';

export const Route = createFileRoute('/applications/')({
  loader: async ({ context }) => {
    const { userId } = await requireAuth();
    await context.queryClient.ensureQueryData(applicationsQueryOptions(userId));
    return { userId };
  },
  component: ApplicationsRoute,
});

function ApplicationsRoute() {
  const { userId } = Route.useLoaderData();
  return <ApplicationsPage userId={userId} />;
}
