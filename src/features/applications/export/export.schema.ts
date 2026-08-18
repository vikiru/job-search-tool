import { z } from 'zod';

export const exportFormatSchema = z.enum(['csv', 'json']);

export const exportRequestSchema = z.object({
  format: exportFormatSchema,
});

export type ExportFormat = z.infer<typeof exportFormatSchema>;
