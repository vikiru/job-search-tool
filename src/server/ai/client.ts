import { GoogleGenAI } from '@google/genai';

import { validateServerEnv } from '@/shared/config/env';

let client: GoogleGenAI | undefined;

export function getGoogleGenAI(): GoogleGenAI {
  if (!client) {
    const { GEMINI_API_KEY } = validateServerEnv();
    client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  return client;
}
