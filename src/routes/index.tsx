import { createFileRoute } from '@tanstack/react-router';

import { HomePage } from '@/pages/home/HomePage';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Home | JobApp' },
      {
        name: 'description',
        content: 'Organize your job search, compare your fit, and keep every application moving.',
      },
    ],
  }),
  component: HomeComponent,
});

function HomeComponent() {
  return <HomePage />;
}
