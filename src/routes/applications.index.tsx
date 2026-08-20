import { createFileRoute } from '@tanstack/react-router';

import { applicationsSearchSchema } from '@/entities/application/search-params';
import { applicationsQueryOptions } from '@/features/application-data/useApplications';
import { requireAuth } from '@/features/auth/server';
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
