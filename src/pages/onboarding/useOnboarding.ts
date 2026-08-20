import { useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';

import { saveUserProfile, type getUserProfile } from '@/features/auth/server';

type OnboardingProfile = Awaited<ReturnType<typeof getUserProfile>>;

export function useOnboarding(profile: OnboardingProfile) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await saveUserProfile({
        data: { firstName, lastName, phoneNumber: phoneNumber || undefined, location: location || undefined },
      });

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
  }

  return {
    errorMessage,
    firstName,
    handleSubmit,
    isSubmitting,
    lastName,
    location,
    phoneNumber,
    setFirstName,
    setLastName,
    setLocation,
    setPhoneNumber,
  };
}
