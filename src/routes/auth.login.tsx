import { createFileRoute } from '@tanstack/react-router';

import { LoginPage } from '@/pages/auth/LoginPage';

export const Route = createFileRoute('/auth/login')({
  head: () => ({
    meta: [
      { title: 'Log in | JobApp' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'description', content: 'Log in to keep your applications, follow-ups, and next steps together.' },
    ],
  }),
  component: LoginPage,
});
