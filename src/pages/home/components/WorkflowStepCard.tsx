import type { LucideIcon } from 'lucide-react';

interface WorkflowStepCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

function WorkflowStepCard({ title, description, icon: Icon }: WorkflowStepCardProps) {
  return (
    <article className="flex gap-5 border-t border-border/70 pt-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-heading text-h4 leading-snug font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}

export { WorkflowStepCard };
