import { z } from 'zod';

import {
  applicationStatusSchema,
  applicationViewSchema,
  interestRatingSchema,
  type ApplicationStatus,
  type ApplicationView,
  type InterestRating,
} from '@/entities/application/model';

export const applicationSortKeys = [
  'company',
  'position',
  'status',
  'location',
  'interestRating',
  'applicationDate',
  'source',
] as const;
export const applicationSortKeySchema = z.enum(applicationSortKeys);
export const applicationSortDirectionSchema = z.enum(['asc', 'desc']);

export const applicationsSearchSchema = z.object({
  search: z.string().default(''),
  status: applicationStatusSchema.or(z.literal('ALL')).default('ALL'),
  interest: interestRatingSchema.or(z.literal('ALL')).default('ALL'),
  sort: applicationSortKeySchema.default('applicationDate'),
  direction: applicationSortDirectionSchema.default('desc'),
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.union([z.literal(5), z.literal(10), z.literal(25)]).catch(10),
  view: applicationViewSchema.default('table'),
});

export type ApplicationSortKey = z.infer<typeof applicationSortKeySchema>;
export type ApplicationSortDirection = z.infer<typeof applicationSortDirectionSchema>;
export type ApplicationsSearch = z.infer<typeof applicationsSearchSchema>;
export type ApplicationsSearchStatus = ApplicationStatus | 'ALL';
export type ApplicationsSearchInterest = InterestRating | 'ALL';
export type ApplicationsSearchView = ApplicationView;
