import { z } from 'zod';

import { isSafeHttpUrl } from '@/shared/lib/urls';

export const httpUrlSchema = z
  .string()
  .trim()
  .url('Enter a valid URL.')
  .refine(isSafeHttpUrl, 'Enter an HTTP or HTTPS URL.');

export const optionalHttpUrlSchema = httpUrlSchema.or(z.literal('')).nullable().optional();

export function parseWithResult<T>(schema: z.ZodType<T>, input: unknown): T | null {
  const parsed = schema.safeParse(input);
  return parsed.success ? parsed.data : null;
}
