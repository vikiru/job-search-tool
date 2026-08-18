import { ThinkingLevel, Type } from '@google/genai';

import { geminiSafetySettings } from '@/features/gemini/safety';

export const GEMINI_ANALYSIS_MODEL = 'gemini-3.6-flash' as const;

export const analysisGenerationConfig = {
  temperature: 0.5,
  thinkingConfig: {
    thinkingLevel: ThinkingLevel.MEDIUM,
  },
  safetySettings: geminiSafetySettings,
  responseMimeType: 'application/json',
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      matchScore: { type: Type.NUMBER },
      tldr: { type: Type.STRING, nullable: true },
      matchedRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
      missingRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
      recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
      observations: { type: Type.STRING, nullable: true },
    },
    required: [
      'matchScore',
      'tldr',
      'matchedRequirements',
      'missingRequirements',
      'strengths',
      'gaps',
      'recommendations',
      'observations',
    ],
  },
} as const;
