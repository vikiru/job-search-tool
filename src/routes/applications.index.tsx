import { createFileRoute } from '@tanstack/react-router';

import { ApplicationsPage } from '@/pages/applications/ApplicationsPage';

export const Route = createFileRoute('/applications/')({
  component: ApplicationsPage,
});
