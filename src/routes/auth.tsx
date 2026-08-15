import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export const Route = createFileRoute('/auth')({
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="p-4 sm:p-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
