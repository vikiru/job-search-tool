import { createFileRoute } from '@tanstack/react-router';
import { SignUp } from '@clerk/tanstack-react-start';

export const Route = createFileRoute('/auth/register')({
  component: RegisterPageComponent,
});

function RegisterPageComponent() {
  return (
    <div className="w-full max-w-md">
      <SignUp routing="path" path="/auth/register" signInUrl="/auth/login" />
    </div>
  );
}
