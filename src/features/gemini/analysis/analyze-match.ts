import { GoogleGenAI } from '@google/genai';

import { analysisGenerationConfig, GEMINI_ANALYSIS_MODEL } from '@/features/gemini/analysis/analysis.config';
import { buildAnalysisPrompt } from '@/features/gemini/analysis/analysis.prompt';
import { analysisSchema, type MatchAnalysisData } from '@/features/gemini/analysis/analysis.schema';
import { validateServerEnv } from '@/shared/config/env';
import { error, success, type Result } from '@/shared/lib/result';

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

  try {
    const { GEMINI_API_KEY } = validateServerEnv();
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: GEMINI_ANALYSIS_MODEL,
      contents: buildAnalysisPrompt(jobDescription, resumeText),
      config: analysisGenerationConfig,
    });
    const parsedJson: unknown = JSON.parse(response.text ?? '');
    const parsed = analysisSchema.safeParse(parsedJson);

    console.info('[gemini analysis] response received', {
      candidates: response.candidates?.length ?? 0,
      finishReason: response.candidates?.[0]?.finishReason ?? 'unknown',
      outputCharacters: response.text?.length ?? 0,
      schemaValid: parsed.success,
    });

    if (import.meta.env.DEV) {
      console.info('[gemini analysis] raw structured output', response.text ?? '');
    }

    if (!parsed.success) {
      console.error('[gemini analysis] schema validation failed', {
        issues: parsed.error.issues.map((issue) => ({
          code: issue.code,
          message: issue.message,
          path: issue.path,
          received: 'received' in issue ? issue.received : undefined,
        })),
      });
      return error('Gemini returned invalid fit analysis.');
    }

    return success(parsed.data);
  } catch (cause) {
    console.error(
      `[gemini analysis:${GEMINI_ANALYSIS_MODEL}]`,
      cause instanceof Error ? `${cause.name}: ${cause.message}` : 'Unknown analysis error',
    );
    return error('We could not analyze this application right now.');
  }
}
