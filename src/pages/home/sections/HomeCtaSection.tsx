import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ClerkLoaded, Show } from '@clerk/tanstack-react-start';

import { Button } from '@/shared/components/ui/button';

function HomeCtaSection() {
  return (
    <section
      aria-labelledby="home-cta-title"
      className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
    >
      <div className="relative overflow-hidden rounded-2xl bg-secondary/70 px-6 py-12 text-secondary-foreground shadow-sm ring-1 ring-foreground/10 dark:bg-card/80 sm:px-10 lg:px-16 lg:py-14">
        <div
          className="absolute -right-20 -bottom-28 size-72 rounded-full border border-primary/15"
          aria-hidden="true"
        />
        <div
          className="absolute -right-8 -bottom-16 size-48 rounded-full border border-primary/10"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl">
          <p className="font-mono text-xs tracking-[0.16em] text-primary uppercase">Your next step</p>
          <h2 id="home-cta-title" className="mt-3 font-heading text-h2 font-semibold tracking-tight text-balance">
            Organize your job search. Track what matters.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Keep applications, resumes, and next steps in one focused workspace.
          </p>
          <div className="mt-7">
            <ClerkLoaded>
              <Show when="signed-out">
                <Button variant="secondary" size="lg" render={<Link to="/auth/register" />}>
                  Start tracking applications
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              </Show>
              <Show when="signed-in">
                <Button variant="secondary" size="lg" render={<Link to="/applications" />}>
                  Open applications
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              </Show>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HomeCtaSection };
