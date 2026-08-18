import { createServerFn } from '@tanstack/react-start';
import { auth } from '@clerk/tanstack-react-start/server';
import { z } from 'zod';

import { analyzeJobApplication } from '@/features/gemini/analysis/analyze-match';
import { findApplicationById } from '@/server/db/queries/applications';
import { upsertAnalysis } from '@/server/db/queries/analysis';
import { findResumeByUserId } from '@/server/db/queries/resumes';
import { error, success, type Result } from '@/shared/lib/result';
import type { MatchAnalysisData } from '@/features/gemini/analysis/analysis.schema';

const analyzeApplicationSchema = z.object({
  applicationId: z.string().uuid(),
  resumeText: z.string().trim().max(200_000).optional().default(''),
});

export const analyzeApplication = createServerFn({ method: 'POST' })
  .validator((input: unknown): Result<z.infer<typeof analyzeApplicationSchema>> => {
    const parsed = analyzeApplicationSchema.safeParse(input);
    return parsed.success ? success(parsed.data) : error('Invalid analysis request.');
  })
  .handler(async ({ data }): Promise<Result<MatchAnalysisData>> => {
    if (!data.success) return data;

    const { userId } = await auth();
    if (!userId) return error('Unauthorized');

    try {
      const application = await findApplicationById(data.data.applicationId, userId);
      if (!application) return error('Application not found.');

      const savedResume = data.data.resumeText ? null : await findResumeByUserId(userId);
      const resumeText = data.data.resumeText || savedResume?.extractedText || undefined;
      const result = await analyzeJobApplication(application.jobDescriptionMd, resumeText);
      if (!result.success) return result;

      const analysis = await upsertAnalysis(application.id, result.data, userId);
      return analysis ? success(result.data) : error('We could not save this fit analysis.');
    } catch (cause) {
      console.error(
        '[gemini analysis server] failed to analyze application',
        cause instanceof Error ? `${cause.name}: ${cause.message}` : 'Unknown analysis persistence error',
      );
      return error('We could not analyze this application right now.');
    }
  });
