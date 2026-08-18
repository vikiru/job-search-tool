import { Button } from '@/shared/components/ui/button';
import { CardFooter } from '@/shared/components/ui/card';

export function OnboardingActionsSection({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <CardFooter className="mt-1 flex justify-end gap-3 px-5 pt-2 pb-7 sm:px-8 sm:pb-9">
      <Button className="w-full font-heading sm:w-auto" size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Get Started'}
      </Button>
    </CardFooter>
  );
}
