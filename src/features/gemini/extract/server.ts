import { createServerFn } from '@tanstack/react-start';
import { auth } from '@clerk/tanstack-react-start/server';
import { z } from 'zod';

import { extractJobDescription } from '@/features/gemini/extract/extract-jd';
import { getOrCreateUser } from '@/server/db/users';
import { insertApplicationWithActivity } from '@/server/db/queries/applications';
import { upsertAnalysis } from '@/server/db/queries/analysis';
import { error, success, type Result } from '@/shared/lib/result';

const createFromJobDescriptionSchema = z.object({
  applicationUrl: z.string().trim().url('Enter a valid URL.').or(z.literal('')).nullable().optional(),
  jobDescriptionMd: z.string().trim().min(1, 'Job description is required.').max(200_000),
});

export interface CreatedApplicationFromJobDescription {
  extractionFailed: boolean;
  id: string;
  metadata: {
    company: string;
    location: string | null;
    position: string;
    salaryCurrency: string | null;
    salaryMax: number | null;
    salaryMin: number | null;
  };
}

export const createApplicationFromJobDescription = createServerFn({ method: 'POST' })
  .validator((input: unknown): Result<z.infer<typeof createFromJobDescriptionSchema>> => {
    const parsed = createFromJobDescriptionSchema.safeParse(input);
    return parsed.success ? success(parsed.data) : error('Enter a valid job description and application URL.');
  })
  .handler(async ({ data }): Promise<Result<CreatedApplicationFromJobDescription>> => {
    if (!data.success) return data;

    const { userId } = await auth();
    if (!userId) return error('Unauthorized');

    const extraction = await extractJobDescription(data.data.jobDescriptionMd);
    const metadata = extraction.success ? extraction.data : null;

    try {
      await getOrCreateUser(userId);
      const application = await insertApplicationWithActivity(
        {
          applicationUrl: data.data.applicationUrl || null,
          applicationInstructions: metadata?.applicationInstructions,
          company: metadata?.company || 'Unknown company',
          employmentType: metadata?.employmentType,
          hoursPerWeek:
            metadata?.hoursPerWeek === null || metadata?.hoursPerWeek === undefined
              ? null
              : String(metadata.hoursPerWeek),
          jobDescriptionMd: metadata?.jobDescriptionMd || data.data.jobDescriptionMd,
          location: metadata?.location,
          position: metadata?.position || 'Untitled role',
          requisitionNumber: metadata?.requisitionNumber,
          salaryCurrency: metadata?.salaryCurrency,
          salaryMax:
            metadata?.salaryMax === null || metadata?.salaryMax === undefined ? null : String(metadata.salaryMax),
          salaryMin:
            metadata?.salaryMin === null || metadata?.salaryMin === undefined ? null : String(metadata.salaryMin),
          salaryPeriod: metadata?.salaryPeriod,
          source: metadata?.source,
          status: 'SAVED',
          workArrangement: metadata?.workArrangement,
        },
        userId,
      );

      if (metadata) {
        await upsertAnalysis(
          application.id,
          {
            benefits: metadata.benefits,
            keywords: metadata.keywords,
            qualifications: metadata.qualifications,
            responsibilities: metadata.responsibilities,
            skills: metadata.skills,
            technologies: metadata.technologies,
          },
          userId,
        );
      }

      return success({
        extractionFailed: !extraction.success,
        id: application.id,
        metadata: {
          company: metadata?.company || 'Unknown company',
          location: metadata?.location ?? null,
          position: metadata?.position || 'Untitled role',
          salaryCurrency: metadata?.salaryCurrency ?? null,
          salaryMax: metadata?.salaryMax ?? null,
          salaryMin: metadata?.salaryMin ?? null,
        },
      });
    } catch {
      return error('We could not save this application.');
    }
  });
