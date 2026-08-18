import { z } from 'zod';

import {
  applicationStatuses,
  type ApplicationStatus,
  type ApplicationView,
  type InterestRating,
} from '@/pages/applications/data';

export const applicationSortKeys = [
  'company',
  'position',
  'status',
  'location',
  'interestRating',
  'applicationDate',
  'source',
] as const;

export type ApplicationSortKey = (typeof applicationSortKeys)[number];
export type ApplicationSortDirection = 'asc' | 'desc';

const statusSchema = z.enum(applicationStatuses);
const interestSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

export const applicationsSearchSchema = z.object({
  search: z.string().default(''),
  status: statusSchema.or(z.literal('ALL')).default('ALL'),
  interest: interestSchema.or(z.literal('ALL')).default('ALL'),
  sort: z.enum(applicationSortKeys).default('applicationDate'),
  direction: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.union([z.literal(5), z.literal(10), z.literal(25)]).catch(10),
  view: z.enum(['table', 'kanban']).default('table'),
});

export type ApplicationsSearch = z.infer<typeof applicationsSearchSchema>;
export type ApplicationsSearchStatus = ApplicationStatus | 'ALL';
export type ApplicationsSearchInterest = InterestRating | 'ALL';
export type ApplicationsSearchView = ApplicationView;
