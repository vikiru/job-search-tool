import type { Result } from '@/shared/lib/result';

import { analysisGenerationConfig, GEMINI_ANALYSIS_MODEL } from '@/server/ai/fit-analysis-config';
import { buildAnalysisPrompt } from '@/server/ai/fit-analysis-prompt';
import { analysisSchema, type MatchAnalysisData } from '@/server/ai/fit-analysis-schema';
import { runStructuredPrompt } from '@/server/ai/runner';

export async function analyzeJobApplication(
  jobDescription: string,
  resumeText?: string,
): Promise<Result<MatchAnalysisData>> {
  console.info('[gemini analysis] request started', {
    hasResume: Boolean(resumeText),
    jobDescriptionCharacters: jobDescription.length,
    model: GEMINI_ANALYSIS_MODEL,
    resumeCharacters: resumeText?.length ?? 0,
  });

  return runStructuredPrompt({
    label: 'analysis',
    model: GEMINI_ANALYSIS_MODEL,
    contents: buildAnalysisPrompt(jobDescription, resumeText),
    config: analysisGenerationConfig,
    schema: analysisSchema,
    invalidResponseMessage: 'Gemini returned invalid fit analysis.',
    requestErrorMessage: 'We could not analyze this application right now.',
  });
}
