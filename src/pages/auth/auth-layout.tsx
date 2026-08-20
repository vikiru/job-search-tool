import { Outlet } from '@tanstack/react-router';

import { Logo } from '@/shared/components/Logo';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:gap-20 lg:px-8 lg:py-20">
        <section className="hidden max-w-xl lg:block">
          <h1 className="font-heading text-display leading-tight font-semibold tracking-tight text-balance">
            Keep your search moving.
          </h1>
          <p className="mt-5 max-w-[42ch] text-p leading-relaxed text-pretty text-muted-foreground">
            Keep applications, follow-ups, and decisions together so the next step is always clear.
          </p>
        </section>
        <section className="flex w-full justify-center">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
