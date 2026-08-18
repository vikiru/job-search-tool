import { createFileRoute } from '@tanstack/react-router';

import { RegisterPage } from '@/pages/auth/RegisterPage';

export const Route = createFileRoute('/auth/register')({
  head: () => ({
    meta: [
      { title: 'Sign up | JobApp' },
      { name: 'description', content: 'Create your JobApp workspace and start organizing your job search.' },
    ],
  }),
  component: RegisterPage,
});
