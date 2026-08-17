import { Github, Globe2, Link2, Linkedin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PublicLink {
  href: string;
  label: string;
}

interface ResumePublicLinksProps {
  links: PublicLink[];
}

export function ResumePublicLinks({ links }: ResumePublicLinksProps) {
  return (
    <div className="mt-6 border-t border-border/60 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link2 className="size-icon-sm text-primary" aria-hidden="true" />
            <h3 className="font-heading text-h5 font-semibold leading-tight tracking-tight">Public links</h3>
          </div>
          <p className="mt-2 max-w-prose text-small leading-relaxed text-muted-foreground">
            Profiles and sites you choose to share with employers.
          </p>
        </div>
        <span className="w-fit rounded-full bg-background/80 px-2.5 py-1 font-heading text-caption font-medium text-muted-foreground">
          {links.length} {links.length === 1 ? 'link' : 'links'}
        </span>
      </div>
      {links.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.label}
              className="flex min-w-0 items-center gap-3 rounded-lg border border-border/70 bg-background/70 px-3 py-3 transition-colors motion-reduce:transition-none hover:bg-background"
              href={`https://${link.href}`}
              target="_blank"
              rel="noreferrer"
            >
              <PublicLinkIcon label={link.label} />
              <span className="min-w-0">
                <span className="block font-heading text-small font-medium">{link.label}</span>
                <span className="block truncate font-mono text-caption text-muted-foreground">{link.href}</span>
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-border px-3 py-4 text-small text-muted-foreground">
          Add a LinkedIn, GitHub, or portfolio link to make it easier for employers to find your work.
        </p>
      )}
    </div>
  );
}

function PublicLinkIcon({ label }: { label: string }) {
  const Icon = publicLinkIcons[label] ?? Globe2;
  return <Icon className="size-icon-base shrink-0 text-primary" aria-hidden="true" />;
}

const publicLinkIcons: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Portfolio: Globe2,
  Website: Globe2,
};

export type { PublicLink };
