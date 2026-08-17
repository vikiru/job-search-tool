import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function OnboardingHeaderSection() {
  return (
    <CardHeader className="gap-3 px-5 pt-7 sm:px-8 sm:pt-9">
      <CardTitle className="font-heading text-h2 font-semibold leading-tight tracking-tight">
        Complete your profile
      </CardTitle>
      <CardDescription className="max-w-[48ch] text-p leading-relaxed">
        Add a few details to personalize your workspace and keep your search organized.
      </CardDescription>
    </CardHeader>
  );
}
