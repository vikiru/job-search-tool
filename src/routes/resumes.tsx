import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/server';
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
  loader: async () => {
    const { userId } = await requireAuth();
    return { userId };
  },
  component: ResumesRoute,
});

function ResumesRoute() {
  const { userId } = Route.useLoaderData();
  return <ResumesPage userId={userId} />;
}
