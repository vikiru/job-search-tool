import { Alert, AlertDescription } from '@/shared/components/ui/alert';

export function OnboardingFeedbackSection({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <Alert className="border-destructive/20 bg-destructive/10" variant="destructive">
      <AlertDescription className="font-medium text-destructive">{message}</AlertDescription>
    </Alert>
  );
}
