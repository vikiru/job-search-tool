import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import type { ApplicationDetail } from '@/features/applications/types';

import { toApplicationRecord } from '@/pages/applications/application-model';
import { ApplicationDetailHeader } from '@/pages/applications/details/components/ApplicationDetailHeader';
import { ApplicationActivitySection } from '@/pages/applications/details/sections/ApplicationActivitySection';
import { ApplicationDetailsSection } from '@/pages/applications/details/sections/ApplicationDetailsSection';
import { ApplicationLinksSection } from '@/pages/applications/details/sections/ApplicationLinksSection';
import { FitAnalysisSection } from '@/pages/applications/details/sections/FitAnalysisSection';
import { JobDescriptionSection } from '@/pages/applications/details/sections/JobDescriptionSection';
import { NotesSection } from '@/pages/applications/details/sections/NotesSection';

interface ApplicationDetailPageProps {
  application: ApplicationDetail;
  userId: string;
}

export function ApplicationDetailPage({ application: detail, userId }: ApplicationDetailPageProps) {
  const application = toApplicationRecord({ ...detail, analysis: detail.analysis });

  return (
    <div className="mx-auto max-w-[var(--breakpoint-2xl)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-7 sm:space-y-9">
        <Link
          className="inline-flex items-center gap-2 font-heading text-small font-medium text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none"
          to="/applications"
        >
          <ArrowLeft className="size-icon-sm" aria-hidden="true" />
          All applications
        </Link>
        <ApplicationDetailHeader application={application} userId={userId} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
          <main className="min-w-0 space-y-6">
            <JobDescriptionSection application={application} showExtractedMetadata={Boolean(detail.analysis)} />
            <FitAnalysisSection analysis={detail.analysis} applicationId={application.id} userId={userId} />
            <NotesSection applicationId={application.id} userId={userId} notes={detail.notes} />
          </main>
          <aside className="min-w-0 space-y-6">
            <ApplicationDetailsSection application={application} />
            <ApplicationLinksSection applicationId={application.id} userId={userId} links={detail.links} />
            <ApplicationActivitySection activity={detail.activity} />
          </aside>
        </div>
      </div>
    </div>
  );
}
