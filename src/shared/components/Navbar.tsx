import { Link } from '@tanstack/react-router';
import { ClerkLoaded, Show, UserButton } from '@clerk/tanstack-react-start';

import { Button } from '@/shared/components/ui/button';
import { Logo } from '@/shared/components/Logo';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

function Navbar() {
  return (
    <header className="border-b border-border/40 bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <ClerkLoaded>
            <Show when="signed-out">
              <div className="flex items-center gap-1.5">
                <Link to="/auth/login">
                  <Button className="font-heading" variant="ghost" size="lg">
                    Sign in
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="font-heading" size="lg">
                    Sign up
                  </Button>
                </Link>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}

export { Navbar };
