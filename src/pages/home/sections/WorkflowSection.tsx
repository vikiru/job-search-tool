import { FileOutput, FileText, KanbanSquare, ScanSearch } from 'lucide-react';

import { WorkflowStepCard } from '@/pages/home/components/WorkflowStepCard';

const workflowSteps = [
  {
    title: 'Capture the job',
    description:
      'Paste a job description and let AI pull out the role, company, location, salary, and other useful details. You can also enter them yourself.',
    icon: FileText,
  },
  {
    title: 'Check your fit',
    description:
      'Compare a job description with your resume to see where you match, where you may need support, and what to talk about in an interview.',
    icon: ScanSearch,
  },
  {
    title: 'Work your pipeline',
    description:
      'Switch between a focused table and a Kanban board as you sort applications from saved to applied, screening, interview, offer, and beyond.',
    icon: KanbanSquare,
  },
  {
    title: 'Take your data with you',
    description:
      'Export your applications and related notes, links, and analysis when you need a copy outside the workspace.',
    icon: FileOutput,
  },
];

function WorkflowSection() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="max-w-2xl">
        <h2
          id="workflow-title"
          className="font-heading text-h2 leading-tight font-semibold tracking-tight text-balance"
        >
          One place for the work behind every application.
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
          JobApp keeps the details, decisions, and follow-ups together so you can spend less time rebuilding context.
        </p>
      </div>
      <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
        {workflowSteps.map((step) => (
          <WorkflowStepCard key={step.title} {...step} />
        ))}
      </div>
    </section>
  );
}

export { WorkflowSection };
