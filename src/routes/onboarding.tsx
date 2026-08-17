import { useState, type FormEvent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { requireAuth, saveUserProfile, getUserProfile } from '@/features/auth/server';
import type { Result } from '@/shared/lib/result';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Field, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

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
          <CardHeader className="gap-3 px-5 pt-7 sm:px-8 sm:pt-9">
            <CardTitle className="font-heading text-h2 font-semibold leading-tight tracking-tight">
              Complete your profile
            </CardTitle>
            <CardDescription className="max-w-[48ch] text-p leading-relaxed">
              Add a few details to personalize your workspace and keep your search organized.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-5 pt-2 sm:px-8">
            {errorMessage && (
              <Alert className="border-destructive/20 bg-destructive/10" variant="destructive">
                <AlertDescription className="font-medium text-destructive">{errorMessage}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <Input
                  id="firstName"
                  required
                  autoComplete="given-name"
                  className="h-11 text-base"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <Input
                  id="lastName"
                  required
                  autoComplete="family-name"
                  className="h-11 text-base"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="phoneNumber">
                Phone number <span className="font-body text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                className="h-11 text-base"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="location">
                Location <span className="font-body text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                id="location"
                autoComplete="address-level2"
                className="h-11 text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Toronto, ON, Canada"
              />
            </Field>
          </CardContent>
          <CardFooter className="mt-1 flex justify-end gap-3 px-5 pb-7 pt-2 sm:px-8 sm:pb-9">
            <Button className="w-full font-heading sm:w-auto" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Get Started'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
