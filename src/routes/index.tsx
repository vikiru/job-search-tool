import { createFileRoute } from '@tanstack/react-router';

import { HomePage } from '@/pages/home/HomePage';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return <HomePage />;
}
