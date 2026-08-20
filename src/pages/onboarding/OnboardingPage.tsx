import { getUserProfile } from '@/features/auth/server';
import { useOnboarding } from '@/pages/onboarding/useOnboarding';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Field, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';

type OnboardingProfile = Awaited<ReturnType<typeof getUserProfile>>;

export function OnboardingPage({ profile }: { profile: OnboardingProfile }) {
  const {
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
  } = useOnboarding(profile);

  return (
    <div className="mx-auto flex w-full max-w-2xl items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
      <Card className="w-full max-w-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="gap-3 px-5 pt-7 sm:px-8 sm:pt-9">
            <CardTitle className="font-heading text-h2 leading-tight font-semibold tracking-tight">
              Complete your profile
            </CardTitle>
            <CardDescription className="max-w-[48ch] text-p leading-relaxed">
              Add a few details to personalize your workspace and keep your search organized.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-5 pt-2 sm:px-8">
            {errorMessage ? (
              <Alert className="border-destructive/20 bg-destructive/10" variant="destructive">
                <AlertDescription className="font-medium text-destructive">{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="firstName">First name</FieldLabel>
                  <Input
                    id="firstName"
                    required
                    autoComplete="given-name"
                    className="h-11 text-base"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
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
                    onChange={(event) => setLastName(event.target.value)}
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
                  onChange={(event) => setPhoneNumber(event.target.value)}
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
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Toronto, ON, Canada"
                />
              </Field>
            </div>
          </CardContent>
          <CardFooter className="mt-1 flex justify-end gap-3 px-5 pt-2 pb-7 sm:px-8 sm:pb-9">
            <Button className="w-full font-heading sm:w-auto" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Get Started'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
