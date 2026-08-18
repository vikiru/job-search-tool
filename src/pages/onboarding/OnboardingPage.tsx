import { useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';

import type { Result } from '@/shared/lib/result';

import { getUserProfile, saveUserProfile } from '@/features/auth/server';
import { OnboardingActionsSection } from '@/pages/onboarding/sections/OnboardingActionsSection';
import { OnboardingFeedbackSection } from '@/pages/onboarding/sections/OnboardingFeedbackSection';
import { OnboardingHeaderSection } from '@/pages/onboarding/sections/OnboardingHeaderSection';
import { OnboardingProfileFieldsSection } from '@/pages/onboarding/sections/OnboardingProfileFieldsSection';
import { Card, CardContent } from '@/shared/components/ui/card';

type OnboardingProfile = Awaited<ReturnType<typeof getUserProfile>>;

export function OnboardingPage({ profile }: { profile: OnboardingProfile }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = (await saveUserProfile({
        data: {
          firstName,
          lastName,
          phoneNumber: phoneNumber || undefined,
          location: location || undefined,
        },
      })) as Result<{ id: string }>;

      if (result.success) {
        await navigate({ to: '/dashboard' });
      } else {
        setErrorMessage(result.error);
      }
    } catch {
      setErrorMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
      <Card className="w-full max-w-xl">
        <form onSubmit={handleSubmit}>
          <OnboardingHeaderSection />
          <CardContent className="space-y-6 px-5 pt-2 sm:px-8">
            <OnboardingFeedbackSection message={errorMessage} />
            <OnboardingProfileFieldsSection
              firstName={firstName}
              lastName={lastName}
              location={location}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onLocationChange={setLocation}
              onPhoneNumberChange={setPhoneNumber}
              phoneNumber={phoneNumber}
            />
          </CardContent>
          <OnboardingActionsSection isSubmitting={isSubmitting} />
        </form>
      </Card>
    </div>
  );
}
