import { z } from 'zod';

export const applicationStatusSchema = z.enum([
  'SAVED',
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
  'GHOSTED',
]);

export const applicationViewSchema = z.enum(['table', 'kanban']);
export const interestRatingSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type ApplicationView = z.infer<typeof applicationViewSchema>;
export type InterestRating = z.infer<typeof interestRatingSchema>;

export const applicationStatuses = applicationStatusSchema.options;

export const statusSortOrder: Record<ApplicationStatus, number> = {
  SAVED: 0,
  APPLIED: 1,
  SCREENING: 2,
  INTERVIEW: 3,
  OFFER: 4,
  REJECTED: 5,
  WITHDRAWN: 6,
  GHOSTED: 7,
};

export const kanbanColumns = [
  { id: 'SAVED', label: 'Saved', statuses: ['SAVED'] },
  { id: 'IN_PROGRESS', label: 'In progress', statuses: ['APPLIED', 'SCREENING'] },
  { id: 'ADVANCED', label: 'Interview & offer', statuses: ['INTERVIEW', 'OFFER'] },
  { id: 'CLOSED', label: 'Closed', statuses: ['REJECTED', 'WITHDRAWN', 'GHOSTED'] },
] as const satisfies ReadonlyArray<{ id: string; label: string; statuses: readonly ApplicationStatus[] }>;

export interface ApplicationRecord {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  location: string;
  interestRating: InterestRating | null;
  applicationDate: string;
  source: string;
  technologies: string[];
  skills?: string[];
  benefits?: string[];
  applicationInstructions?: string[];
  qualifications?: string[];
  keywords?: string[];
  applicationUrl?: string | null;
  jobDescriptionMd?: string;
  workArrangement?: string | null;
  employmentType?: string | null;
  salaryMin?: string | null;
  salaryMax?: string | null;
  salaryCurrency?: string | null;
  salaryPeriod?: string | null;
  hoursPerWeek?: string | null;
  requisitionNumber?: string | null;
}

interface ApplicationWithAnalysis {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  location: string | null;
  interestRating: number | null;
  applicationDate: string;
  source: string | null;
  applicationUrl?: string | null;
  applicationInstructions?: string[] | null;
  jobDescriptionMd?: string;
  workArrangement?: string | null;
  employmentType?: string | null;
  salaryMin?: string | null;
  salaryMax?: string | null;
  salaryCurrency?: string | null;
  salaryPeriod?: string | null;
  hoursPerWeek?: string | null;
  requisitionNumber?: string | null;
  analysis?: {
    technologies: string[] | null;
    skills: string[] | null;
    benefits: string[] | null;
    qualifications: string[] | null;
    keywords: string[] | null;
  } | null;
}

export function toApplicationRecord(application: ApplicationWithAnalysis): ApplicationRecord {
  return {
    applicationDate: application.applicationDate,
    applicationUrl: application.applicationUrl,
    company: application.company,
    id: application.id,
    interestRating: interestRatingSchema.safeParse(application.interestRating).data ?? null,
    jobDescriptionMd: application.jobDescriptionMd,
    applicationInstructions: application.applicationInstructions ?? [],
    benefits: application.analysis?.benefits ?? [],
    employmentType: application.employmentType,
    hoursPerWeek: application.hoursPerWeek,
    keywords: application.analysis?.keywords ?? [],
    location: application.location ?? 'Not specified',
    qualifications: application.analysis?.qualifications ?? [],
    position: application.position,
    requisitionNumber: application.requisitionNumber,
    salaryCurrency: application.salaryCurrency,
    salaryMax: application.salaryMax,
    salaryMin: application.salaryMin,
    salaryPeriod: application.salaryPeriod,
    skills: application.analysis?.skills ?? [],
    source: application.source ?? 'Not specified',
    status: application.status,
    technologies: application.analysis?.technologies ?? [],
    workArrangement: application.workArrangement,
  };
}

export function formatStatus(status: ApplicationStatus): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function formatApplicationDate(value: string): string {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(`${value}T12:00:00`),
  );
}
