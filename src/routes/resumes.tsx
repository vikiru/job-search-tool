import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';
import { resumesQueryOptions } from '@/features/resume-management/useResumes';
import { ResumesPage } from '@/pages/resumes/ResumesPage';
import { userContactQueryOptions } from '@/pages/resumes/useUserContact';

export const Route = createFileRoute('/resumes')({
  head: () => ({
    meta: [
      { title: 'Resume | JobApp' },
      { name: 'robots', content: 'noindex, nofollow' },
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
