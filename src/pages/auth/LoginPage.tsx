import { SignIn } from '@clerk/tanstack-react-start';

export function LoginPage() {
  return (
    <div className="w-full max-w-md py-4">
      <SignIn routing="path" path="/auth/login" signUpUrl="/auth/register" />
    </div>
  );
}
