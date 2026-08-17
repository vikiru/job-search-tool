import { CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export function OnboardingActionsSection({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <CardFooter className="mt-1 flex justify-end gap-3 px-5 pb-7 pt-2 sm:px-8 sm:pb-9">
      <Button className="w-full font-heading sm:w-auto" size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Get Started'}
      </Button>
    </CardFooter>
  );
}
