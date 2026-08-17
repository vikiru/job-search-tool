import { ShieldCheck } from 'lucide-react';

import { ResumeContactDetails } from '@/pages/resumes/components/ResumeContactDetails';
import { ResumeContent, ResumeRole, ResumeSection } from '@/pages/resumes/components/ResumeContent';
import { ResumeDocument } from '@/pages/resumes/components/ResumeDocument';

export function ResumeContentSection() {
  return (
    <div className="space-y-6">
      <ResumeDocument filename="john-doe-resume.pdf">
        <ResumeContent
          location="Toronto, ON"
          name="John Doe"
          summary="Product designer with 7 years of experience turning complex workflows into clear, useful products. I work across discovery, interaction design, prototyping, and design systems with product and engineering teams."
          title="Product Designer"
        >
          <ResumeSection heading="Experience">
            <div className="space-y-6">
              <ResumeRole
                company="Northstar Labs"
                description="Led the redesign of the customer workspace, improving task completion and reducing support requests. Built a shared component library that helped three product teams ship more consistently."
                position="Senior Product Designer"
              />
              <ResumeRole
                company="Paperplane"
                description="Shaped research plans, prototypes, and launch experiences for a growing B2B platform. Partnered with engineering to establish a practical design system."
                position="Product Designer"
              />
            </div>
          </ResumeSection>
          <ResumeSection heading="Skills">
            <p className="max-w-prose text-small leading-relaxed text-muted-foreground">
              Product strategy, user research, interaction design, prototyping, design systems, usability testing,
              Figma, and accessibility.
            </p>
          </ResumeSection>
        </ResumeContent>
      </ResumeDocument>
      <ResumeContactDetails />
      <div className="flex items-start gap-3 rounded-lg border border-success/20 bg-success/5 px-4 py-4 sm:px-5">
        <ShieldCheck className="mt-0.5 size-icon-base shrink-0 text-success" aria-hidden="true" />
        <div className="min-w-0 space-y-1">
          <p className="font-heading text-small font-semibold leading-snug tracking-tight">
            Your source file stays private
          </p>
          <p className="max-w-prose text-small leading-relaxed text-pretty text-muted-foreground">
            We process your PDF securely and don’t store the original file. JobApp keeps the extracted text so you can
            review it and use it for fit analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
