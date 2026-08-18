import { ThinkingLevel, Type } from '@google/genai';

import { geminiSafetySettings } from '@/features/gemini/safety';

export const GEMINI_EXTRACTION_MODEL = 'gemini-3.5-flash-lite' as const;

export const extractionGenerationConfig = {
  temperature: 0.1,
  thinkingConfig: {
    thinkingLevel: ThinkingLevel.LOW,
  },
  safetySettings: geminiSafetySettings,
  responseMimeType: 'application/json',
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      jobDescriptionMd: { type: Type.STRING, nullable: true },
      company: { type: Type.STRING, nullable: true },
      position: { type: Type.STRING, nullable: true },
      location: { type: Type.STRING, nullable: true },
      workArrangement: { type: Type.STRING, nullable: true },
      employmentType: { type: Type.STRING, nullable: true },
      salaryMin: { type: Type.NUMBER, nullable: true },
      salaryMax: { type: Type.NUMBER, nullable: true },
      salaryCurrency: { type: Type.STRING, nullable: true },
      salaryPeriod: { type: Type.STRING, nullable: true },
      hoursPerWeek: { type: Type.NUMBER, nullable: true },
      requisitionNumber: { type: Type.STRING, nullable: true },
      applicationInstructions: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
      source: { type: Type.STRING, nullable: true },
      technologies: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
      skills: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
      qualifications: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
      responsibilities: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
      benefits: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
      keywords: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
    },
    required: [
      'jobDescriptionMd',
      'company',
      'position',
      'location',
      'workArrangement',
      'employmentType',
      'salaryMin',
      'salaryMax',
      'salaryCurrency',
      'salaryPeriod',
      'hoursPerWeek',
      'requisitionNumber',
      'applicationInstructions',
      'source',
      'technologies',
      'skills',
      'qualifications',
      'responsibilities',
      'benefits',
      'keywords',
    ],
  },
} as const;
