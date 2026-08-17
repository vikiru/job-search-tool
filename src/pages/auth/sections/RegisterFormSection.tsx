import { SignUp } from '@clerk/tanstack-react-start';

export function RegisterFormSection() {
  return (
    <div className="w-full max-w-md py-4">
      <SignUp routing="path" path="/auth/register" signInUrl="/auth/login" forceRedirectUrl="/onboarding" />
    </div>
  );
}
