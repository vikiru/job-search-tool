import { createFileRoute } from '@tanstack/react-router';
import { SignIn } from '@clerk/tanstack-react-start';

export const Route = createFileRoute('/auth/login')({
  component: LoginPageComponent,
});

function LoginPageComponent() {
  return (
    <div className="w-full max-w-md">
      <SignIn routing="path" path="/auth/login" signUpUrl="/auth/register" />
    </div>
  );
}
