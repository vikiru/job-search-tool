import { z } from 'zod';

export const analysisSchema = z.object({
  matchScore: z.number().min(0).max(100),
  tldr: z.string().nullable(),
  matchedRequirements: z.array(z.string()).default([]),
  missingRequirements: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  observations: z.string().nullable(),
});

export type MatchAnalysisData = z.infer<typeof analysisSchema>;
