import { SignIn } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/login/$')({
  head: () => ({
    meta: [
      { title: 'Log in | JobApp' },
      { name: 'description', content: 'Log in to keep your applications, follow-ups, and next steps together.' },
    ],
  }),
  component: LoginPageComponent,
});

function LoginPageComponent() {
  return (
    <div className="w-full max-w-md py-4">
      <SignIn routing="path" path="/auth/login" signUpUrl="/auth/register" />
    </div>
  );
}
