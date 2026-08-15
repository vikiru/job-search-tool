import { createFileRoute, Link } from '@tanstack/react-router';
import { Show, UserButton } from '@clerk/tanstack-react-start';
import { Button } from '@/shared/components/ui/button';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg font-bold">JobApp</span>
        </div>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">JobApp</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Track job applications, match resumes, and analyze job descriptions with AI.
        </p>
      </main>
    </div>
  );
}
