import { GoogleGenAI } from '@google/genai';

import { extractionGenerationConfig, GEMINI_EXTRACTION_MODEL } from '@/features/gemini/extract/extraction.config';
import { buildExtractionPrompt } from '@/features/gemini/extract/extraction.prompt';
import { normalizeExtractionPayload } from '@/features/gemini/extract/extraction.normalize';
import { extractionSchema, type ExtractionData } from '@/features/gemini/extract/extraction.schema';
import { validateServerEnv } from '@/shared/config/env';
import { error, success, type Result } from '@/shared/lib/result';

export async function extractJobDescription(jobDescription: string): Promise<Result<ExtractionData>> {
  console.info('[gemini extraction] request started', {
    inputCharacters: jobDescription.length,
    model: GEMINI_EXTRACTION_MODEL,
  });

  try {
    const { GEMINI_API_KEY } = validateServerEnv();
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: GEMINI_EXTRACTION_MODEL,
      contents: buildExtractionPrompt(jobDescription),
      config: extractionGenerationConfig,
    });
    const parsedJson: unknown = JSON.parse(response.text ?? '');
    const parsed = extractionSchema.safeParse(normalizeExtractionPayload(parsedJson));

    console.info('[gemini extraction] response received', {
      candidates: response.candidates?.length ?? 0,
      finishReason: response.candidates?.[0]?.finishReason ?? 'unknown',
      outputCharacters: response.text?.length ?? 0,
      schemaValid: parsed.success,
    });

    if (import.meta.env.DEV) {
      console.info('[gemini extraction] raw structured output', response.text ?? '');
    }

    if (!parsed.success) {
      console.error('[gemini extraction] schema validation failed', {
        issues: parsed.error.issues.map((issue) => ({
          code: issue.code,
          message: issue.message,
          path: issue.path,
          received: 'received' in issue ? issue.received : undefined,
        })),
      });
      return error('Gemini returned invalid job metadata.');
    }

    return success(parsed.data);
  } catch (cause) {
    console.error(
      `[gemini extraction:${GEMINI_EXTRACTION_MODEL}]`,
      cause instanceof Error ? `${cause.name}: ${cause.message}` : 'Unknown extraction error',
    );
    return error('We could not extract job details right now.');
  }
}
