import { ArrowLeft, BriefcaseBusiness, CalendarDays, MapPin, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import {
  ApplicationActivityCard,
  ApplicationDetailsCard,
  ApplicationLinksCard,
  FitAnalysisCard,
  JobDescriptionCard,
  NotesCard,
} from '@/pages/applications/components/ApplicationDetailSections';
import { EditApplicationDialog } from '@/pages/applications/components/EditApplicationDialog';
import { formatApplicationDate, type ApplicationRecord } from '@/pages/applications/data';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';

interface ApplicationDetailPageProps {
  application: ApplicationRecord;
}

function ApplicationDetailPage({ application }: ApplicationDetailPageProps) {
  return (
    <div className="mx-auto max-w-[var(--breakpoint-2xl)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-6 sm:space-y-8">
        <Link
          className="inline-flex items-center gap-2 font-heading text-small font-medium text-muted-foreground transition-colors motion-reduce:transition-none hover:text-foreground"
          to="/applications"
        >
          <ArrowLeft className="size-icon-sm" aria-hidden="true" />
          All applications
        </Link>
        <ApplicationDetailHeader application={application} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
          <main className="min-w-0 space-y-6">
            <JobDescriptionCard application={application} />
            <FitAnalysisCard hasAnalysis={false} />
            <NotesCard />
          </main>
          <aside className="min-w-0 space-y-6">
            <ApplicationDetailsCard application={application} />
            <ApplicationLinksCard />
            <ApplicationActivityCard />
          </aside>
        </div>
      </div>
    </div>
  );
}

function ApplicationDetailHeader({ application }: { application: ApplicationRecord }) {
  return (
    <header className="space-y-5 border-b border-border/70 pb-6 sm:pb-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div>
            <h1 className="font-heading text-h1 font-semibold leading-tight tracking-tight text-balance">
              {application.position}
            </h1>
            <p className="mt-2 font-heading text-h4 font-medium text-muted-foreground">{application.company}</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-small text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-icon-sm" aria-hidden="true" />
              {application.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-icon-sm" aria-hidden="true" />
              Added {formatApplicationDate(application.applicationDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-icon-sm" aria-hidden="true" />
              {application.source}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <EditApplicationDialog application={application} />
          <ConfirmDialog
            trigger={
              <Button variant="destructive" className="font-heading">
                <Trash2 data-icon="inline-start" aria-hidden="true" />
                Delete application
              </Button>
            }
            heading="Delete this application?"
            body="This will permanently remove the application, notes, links, and analysis connected to it. This action cannot be undone."
            actionLabel="Delete application"
          />
        </div>
      </div>
    </header>
  );
}

export { ApplicationDetailPage };
