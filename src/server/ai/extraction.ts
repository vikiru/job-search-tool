import type { Result } from '@/shared/lib/result';

import { extractionGenerationConfig, GEMINI_EXTRACTION_MODEL } from '@/server/ai/extraction-config';
import { normalizeExtractionPayload } from '@/server/ai/extraction-normalize';
import { buildExtractionPrompt } from '@/server/ai/extraction-prompt';
import { extractionSchema, type ExtractionData } from '@/server/ai/extraction-schema';
import { runStructuredPrompt } from '@/server/ai/runner';

export async function extractJobDescription(jobDescription: string): Promise<Result<ExtractionData>> {
  console.info('[gemini extraction] request started', {
    inputCharacters: jobDescription.length,
    model: GEMINI_EXTRACTION_MODEL,
  });

  return runStructuredPrompt({
    label: 'extraction',
    model: GEMINI_EXTRACTION_MODEL,
    contents: buildExtractionPrompt(jobDescription),
    config: extractionGenerationConfig,
    schema: extractionSchema,
    normalize: normalizeExtractionPayload,
    invalidResponseMessage: 'Gemini returned invalid job metadata.',
    requestErrorMessage: 'We could not extract job details right now.',
  });
}
