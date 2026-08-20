import { auth } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import type { MatchAnalysisData } from '@/server/ai/fit-analysis-schema';

import { analyzeJobApplication } from '@/server/ai/fit-analysis-analyze';
import { upsertAnalysis } from '@/server/db/queries/analysis';
import { findApplicationById } from '@/server/db/queries/applications';
import { findResumeByUserId } from '@/server/db/queries/resumes';
import { logServerError } from '@/server/lib/log-error';
import { error, success, type Result } from '@/shared/lib/result';

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
      logServerError('gemini:analysis', cause);
      return error('We could not analyze this application right now.');
    }
  });
