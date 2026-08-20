import { extractJobDescription as runJobDescriptionExtraction } from '@/server/ai/extraction';

export { type ExtractionData } from '@/server/ai/extraction-schema';

export function extractJobDescription(jobDescription: string) {
  return runJobDescriptionExtraction(jobDescription);
}
