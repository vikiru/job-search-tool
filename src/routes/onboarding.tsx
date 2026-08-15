import { useState, type FormEvent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { requireAuth, saveUserProfile, getUserProfile } from '@/features/auth/server';
import type { Result } from '@/shared/lib/result';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';

export const Route = createFileRoute('/onboarding')({
  beforeLoad: async () => {
    await requireAuth();
  },
  loader: async () => {
    const profile = await getUserProfile();
    return { profile };
  },
  component: OnboardingComponent,
});

function OnboardingComponent() {
  const { profile } = Route.useLoaderData();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        await navigate({ to: '/' });
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Complete Your Profile</CardTitle>
            <CardDescription className="font-body">
              Set up your basic contact info for automated application tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive font-medium">
                {errorMessage}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Toronto, ON, Canada"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Get Started'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
