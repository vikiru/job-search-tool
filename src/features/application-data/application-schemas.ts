import { z } from 'zod';

import { ApplicationStatusSchema, SalaryPeriodSchema, WorkArrangementSchema } from '@/server/db/zod';
import { httpUrlSchema, optionalHttpUrlSchema } from '@/shared/lib/validation';

const optionalText = (maxLength: number) => z.string().trim().max(maxLength).nullable().optional();

const optionalUrl = optionalHttpUrlSchema;

const optionalNumeric = (max?: number) => {
  const schema = z.number().finite().nonnegative();
  return (max ? schema.max(max) : schema).transform(String).nullable().optional();
};

const applicationFields = {
  company: z.string().trim().min(1, 'Company is required.').max(200),
  position: z.string().trim().min(1, 'Role is required.').max(200),
  status: ApplicationStatusSchema.default('SAVED'),
  interestRating: z.number().int().min(1).max(5).nullable().optional(),
  location: optionalText(200),
  workArrangement: WorkArrangementSchema.nullable().optional(),
  employmentType: optionalText(100),
  salaryMin: optionalNumeric(),
  salaryMax: optionalNumeric(),
  salaryCurrency: optionalText(10),
  salaryPeriod: SalaryPeriodSchema.nullable().optional(),
  hoursPerWeek: z.number().finite().positive().max(168).transform(String).nullable().optional(),
  requisitionNumber: optionalText(100),
  applicationInstructions: z.array(z.string().trim().min(1).max(500)).max(50).nullable().optional(),
  applicationUrl: optionalUrl,
  applicationDate: z.string().date().optional(),
  source: optionalText(100),
  jobDescriptionMd: z.string().trim().min(1, 'Job description is required.').max(200_000),
};

export const createApplicationSchema = z.object(applicationFields);

export const updateApplicationSchema = z.object({
  id: z.string().uuid(),
  data: z
    .object({
      ...applicationFields,
      company: applicationFields.company.optional(),
      position: applicationFields.position.optional(),
      status: applicationFields.status.optional(),
      jobDescriptionMd: applicationFields.jobDescriptionMd.optional(),
    })
    .partial(),
});

export const statusUpdateSchema = z.object({ id: z.string().uuid(), status: ApplicationStatusSchema });
export const applicationResourceSchema = z.object({ id: z.string().uuid() });

export const noteMutationSchema = z.object({
  applicationId: z.string().uuid(),
  content: z.string().trim().min(1).max(20_000),
});

export const noteUpdateSchema = z.object({ id: z.string().uuid(), content: z.string().trim().min(1).max(20_000) });

export const linkMutationSchema = z.object({
  applicationId: z.string().uuid(),
  url: httpUrlSchema,
  label: optionalText(100),
});

export const linkUpdateSchema = z.object({
  id: z.string().uuid(),
  url: httpUrlSchema,
  label: optionalText(100),
});
export const recentActivitySchema = z.object({ limit: z.number().int().min(1).max(50).default(10) });

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
