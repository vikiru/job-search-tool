import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ClerkLoaded, Show } from '@clerk/tanstack-react-start';

import { HeroPreview } from '@/pages/home/components/HeroPreview';
import { Button } from '@/shared/components/ui/button';

function HomeHeroSection() {
  return (
    <section aria-labelledby="home-hero-title" className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_38%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.78fr)] lg:items-center lg:gap-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <h1
            id="home-hero-title"
            className="max-w-[13ch] text-display font-heading font-semibold leading-tight tracking-tight text-balance"
          >
            Keep your job search moving.
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            Save a job, pull out the details that matter, compare it with your resume, and keep the next step in view.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ClerkLoaded>
              <Show when="signed-out">
                <Button className="font-heading" size="lg" render={<Link to="/auth/register" />}>
                  Start tracking
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
                <Button className="font-heading" variant="ghost" size="lg" render={<Link to="/auth/login" />}>
                  Sign in
                </Button>
              </Show>
              <Show when="signed-in">
                <Button className="font-heading" size="lg" render={<Link to="/applications" />}>
                  Open workspace
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              </Show>
            </ClerkLoaded>
          </div>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}

export { HomeHeroSection };
