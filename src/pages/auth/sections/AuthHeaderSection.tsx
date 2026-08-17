import { Logo } from '@/shared/components/Logo';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

export function AuthHeaderSection() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <Logo />
      <ThemeToggle />
    </header>
  );
}
