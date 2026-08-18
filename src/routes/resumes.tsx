import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';
import { userContactQueryOptions } from '@/features/profile/hooks/useUserContact';
import { resumesQueryOptions } from '@/features/resumes/hooks/useResumes';
import { ResumesPage } from '@/pages/resumes/ResumesPage';

export const Route = createFileRoute('/resumes')({
  head: () => ({
    meta: [
      { title: 'Resume | JobApp' },
      {
        name: 'description',
        content: 'Keep your resume, extracted text, and professional links ready for every application.',
      },
    ],
  }),
  beforeLoad: async () => await requireAuth(),
  loader: async ({ context }) => {
    const { userId } = await requireAuth();
    await Promise.all([
      context.queryClient.ensureQueryData(resumesQueryOptions(userId)),
      context.queryClient.ensureQueryData(userContactQueryOptions(userId)),
    ]);
    return { userId };
  },
  component: ResumesRoute,
});

function ResumesRoute() {
  const { userId } = Route.useLoaderData();
  return <ResumesPage userId={userId} />;
}
