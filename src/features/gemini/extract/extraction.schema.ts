import { z } from 'zod';

export const extractionSchema = z.object({
  jobDescriptionMd: z.string().nullable(),
  company: z.string().nullable(),
  position: z.string().nullable(),
  location: z.string().nullable(),
  workArrangement: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).nullable(),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']).nullable(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  salaryCurrency: z.string().nullable(),
  salaryPeriod: z.enum(['YEARLY', 'HOURLY', 'MONTHLY', 'WEEKLY']).nullable(),
  hoursPerWeek: z.number().nullable(),
  requisitionNumber: z.string().nullable(),
  applicationInstructions: z.array(z.string()).nullable(),
  source: z.string().nullable(),
  technologies: z.array(z.string()).nullable(),
  skills: z.array(z.string()).nullable(),
  qualifications: z.array(z.string()).nullable(),
  responsibilities: z.array(z.string()).nullable(),
  benefits: z.array(z.string()).nullable(),
  keywords: z.array(z.string()).nullable(),
});

export type ExtractionData = z.infer<typeof extractionSchema>;
