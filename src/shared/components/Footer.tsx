import { Logo } from '@/shared/components/Logo';

function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-lg space-y-6">
          <Logo />
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Keep job descriptions, resume versions, follow-ups, and next steps in one place while you work through your
            search.
          </p>
          <p className="pt-2 font-heading text-sm leading-normal text-muted-foreground/80">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> JobApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
