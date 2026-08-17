import { AuthBrandSection } from '@/pages/auth/sections/AuthBrandSection';
import { AuthFormSection } from '@/pages/auth/sections/AuthFormSection';
import { AuthHeaderSection } from '@/pages/auth/sections/AuthHeaderSection';

export function AuthLayoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <AuthHeaderSection />
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:gap-20 lg:px-8 lg:py-20">
        <AuthBrandSection />
        <AuthFormSection />
      </main>
    </div>
  );
}
