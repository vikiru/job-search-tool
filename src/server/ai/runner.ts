import type { GenerateContentParameters } from '@google/genai';

import { z } from 'zod';

import { getGoogleGenAI } from '@/server/ai/client';
import { error, success, type Result } from '@/shared/lib/result';

interface StructuredPromptOptions<T> {
  label: string;
  model: string;
  contents: GenerateContentParameters['contents'];
  config: GenerateContentParameters['config'];
  schema: z.ZodType<T, z.ZodTypeDef, unknown>;
  normalize?: (value: unknown) => unknown;
  invalidResponseMessage: string;
  requestErrorMessage: string;
}

export async function runStructuredPrompt<T>(options: StructuredPromptOptions<T>): Promise<Result<T>> {
  try {
    const response = await getGoogleGenAI().models.generateContent({
      model: options.model,
      contents: options.contents,
      config: options.config,
    });
    const rawOutput = response.text ?? '';
    const parsedJson: unknown = JSON.parse(rawOutput);
    const parsed = options.schema.safeParse(options.normalize ? options.normalize(parsedJson) : parsedJson);

    console.info(`[gemini ${options.label}] response received`, {
      candidates: response.candidates?.length ?? 0,
      finishReason: response.candidates?.[0]?.finishReason ?? 'unknown',
      outputCharacters: rawOutput.length,
      schemaValid: parsed.success,
    });

    if (import.meta.env.DEV) {
      console.info(`[gemini ${options.label}] raw structured output`, rawOutput);
    }

    if (!parsed.success) {
      console.error(`[gemini ${options.label}] schema validation failed`, {
        issues: parsed.error.issues.map((issue) => ({ code: issue.code, message: issue.message, path: issue.path })),
      });
      return error(options.invalidResponseMessage);
    }

    return success(parsed.data);
  } catch (cause) {
    console.error(
      `[gemini ${options.label}:${options.model}]`,
      cause instanceof Error ? `${cause.name}: ${cause.message}` : 'Unknown AI error',
    );
    return error(options.requestErrorMessage);
  }
}
