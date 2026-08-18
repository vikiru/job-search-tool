import { SignUp } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/register/$')({
  head: () => ({
    meta: [
      { title: 'Sign up | JobApp' },
      { name: 'description', content: 'Create your JobApp workspace and start organizing your job search.' },
    ],
  }),
  component: RegisterPageComponent,
});

function RegisterPageComponent() {
  return (
    <div className="w-full max-w-md py-4">
      <SignUp routing="path" path="/auth/register" signInUrl="/auth/login" forceRedirectUrl="/onboarding" />
    </div>
  );
}
