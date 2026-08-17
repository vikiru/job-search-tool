import { createFileRoute } from '@tanstack/react-router';

import { AuthLayoutPage } from '@/pages/auth/AuthLayoutPage';

export const Route = createFileRoute('/auth')({
  component: AuthLayoutPage,
});
