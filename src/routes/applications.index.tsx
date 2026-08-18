import { createFileRoute } from '@tanstack/react-router';

import { applicationsQueryOptions } from '@/features/applications/hooks/useApplications';
import { requireAuth } from '@/features/auth/server';
import { applicationsSearchSchema } from '@/pages/applications/application-search-params';
import { ApplicationsPage } from '@/pages/applications/ApplicationsPage';

export const Route = createFileRoute('/applications/')({
  validateSearch: applicationsSearchSchema,
  loader: async ({ context }) => {
    const { userId } = await requireAuth();
    await context.queryClient.ensureQueryData(applicationsQueryOptions(userId));
    return { userId };
  },
  component: ApplicationsRoute,
});

function ApplicationsRoute() {
  const { userId } = Route.useLoaderData();
  const search = Route.useSearch();
  return <ApplicationsPage search={search} userId={userId} />;
}
