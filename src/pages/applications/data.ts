export const applicationStatuses = [
  'SAVED',
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
  'GHOSTED',
] as const;

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
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  statuses: readonly ApplicationStatus[];
}>;

export type ApplicationStatus = (typeof applicationStatuses)[number];
export type ApplicationView = 'table' | 'kanban';
export type InterestRating = 1 | 2 | 3 | 4 | 5;

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

export function toApplicationRecord(application: {
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
}): ApplicationRecord {
  return {
    applicationDate: application.applicationDate,
    applicationUrl: application.applicationUrl,
    company: application.company,
    id: application.id,
    interestRating: application.interestRating as InterestRating | null,
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

export function getApplicationJobDescription(application: ApplicationRecord) {
  return `${application.company} is looking for a ${application.position} to help shape thoughtful tools for teams doing complex work. You will partner with product, engineering, and research to turn customer needs into clear, useful experiences.

The role spans discovery, interaction design, prototyping, and delivery. You will also contribute to the design system and help create a consistent product experience as the team grows.`;
}

export const applications: ApplicationRecord[] = [
  {
    id: '0e8f5a8e-2f7e-4e3d-9b5f-1c2a7d4e6f80',
    company: 'Northstar Labs',
    position: 'Product Designer',
    status: 'INTERVIEW',
    location: 'Toronto, ON',
    interestRating: 5,
    applicationDate: '2026-08-21',
    source: 'Referral',
    technologies: ['Figma', 'Design systems'],
  },
  {
    id: '1a6c9d42-7b3e-4f18-8c50-2e9a6d1b4f73',
    company: 'Arc & Field',
    position: 'UX Researcher',
    status: 'APPLIED',
    location: 'Remote',
    interestRating: 4,
    applicationDate: '2026-08-20',
    source: 'LinkedIn',
    technologies: ['Research', 'SaaS'],
  },
  {
    id: '2d4b8f61-0c9e-4a27-b5d3-7f1e6c8a9b02',
    company: 'Monument Studio',
    position: 'Design Lead',
    status: 'SCREENING',
    location: 'New York, NY',
    interestRating: 5,
    applicationDate: '2026-08-19',
    source: 'Company site',
    technologies: ['Leadership', 'B2B'],
  },
  {
    id: '3f7a1c84-5e2b-4d90-a6c8-1b9f3e7d2a45',
    company: 'Tideway',
    position: 'Content Designer',
    status: 'SAVED',
    location: 'Remote',
    interestRating: 3,
    applicationDate: '2026-08-18',
    source: 'Otta',
    technologies: ['UX writing', 'Fintech'],
  },
  {
    id: '4b2e6d97-8a1f-4c53-9e70-3d5b1a6f8c24',
    company: 'Common Ground',
    position: 'Service Designer',
    status: 'OFFER',
    location: 'Vancouver, BC',
    interestRating: 5,
    applicationDate: '2026-08-16',
    source: 'Referral',
    technologies: ['Journey mapping', 'Research'],
  },
  {
    id: '5c9d3a10-6f4b-4e82-b7d1-9a2c5f8e0b63',
    company: 'Lattice',
    position: 'Growth Designer',
    status: 'REJECTED',
    location: 'San Francisco, CA',
    interestRating: 3,
    applicationDate: '2026-08-14',
    source: 'LinkedIn',
    technologies: ['Growth', 'Experiments'],
  },
  {
    id: '6e1f4b25-9c7a-4d60-8b3e-2f5a9d1c7e84',
    company: 'Kindred Health',
    position: 'Design Systems Designer',
    status: 'WITHDRAWN',
    location: 'Remote',
    interestRating: 2,
    applicationDate: '2026-08-11',
    source: 'Company site',
    technologies: ['React', 'Tokens'],
  },
  {
    id: '7a3c8e46-1d5f-4b92-a0e7-6c2f9b4d8a15',
    company: 'Fieldnote',
    position: 'Associate Product Manager',
    status: 'GHOSTED',
    location: 'Chicago, IL',
    interestRating: 3,
    applicationDate: '2026-08-07',
    source: 'Wellfound',
    technologies: ['Product strategy', 'Analytics'],
  },
  {
    id: '8b5d2f73-4a6c-4e10-9d8b-1f3c7a6e2b90',
    company: 'Orbit Commerce',
    position: 'Frontend Engineer',
    status: 'SAVED',
    location: 'Remote',
    interestRating: 4,
    applicationDate: '2026-08-05',
    source: 'Company site',
    technologies: ['React', 'TypeScript'],
  },
  {
    id: '9c7e1a58-3b0d-4f26-8e4c-5a2d6b9f1c70',
    company: 'Westward',
    position: 'Product Designer',
    status: 'APPLIED',
    location: 'Austin, TX',
    interestRating: 4,
    applicationDate: '2026-08-02',
    source: 'Indeed',
    technologies: ['Figma', 'Mobile'],
  },
];

export function formatStatus(status: ApplicationStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function formatApplicationDate(value: string) {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`));
}
