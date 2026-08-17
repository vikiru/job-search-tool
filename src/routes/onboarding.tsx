import { createFileRoute } from '@tanstack/react-router';

import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { getUserProfile, requireAuth } from '@/features/auth/server';

export const Route = createFileRoute('/onboarding')({
  head: () => ({
    meta: [
      { title: 'Onboarding | JobApp' },
      { name: 'description', content: 'Add a few details to personalize your JobApp workspace.' },
    ],
  }),
  beforeLoad: async () => await requireAuth(),
  loader: async () => {
    const profile = await getUserProfile();
    return { profile };
  },
  component: OnboardingRouteComponent,
});

function OnboardingRouteComponent() {
  const { profile } = Route.useLoaderData();
  return <OnboardingPage profile={profile} />;
}
