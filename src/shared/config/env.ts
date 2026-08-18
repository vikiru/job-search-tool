import { z } from 'zod';

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().trim().min(1, 'DATABASE_URL is required'),
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
  GEMINI_API_KEY: z.string().trim().min(1, 'GEMINI_API_KEY is required'),
});

const clientEnvSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'VITE_CLERK_PUBLISHABLE_KEY is required'),
  VITE_CLERK_SIGN_IN_URL: z.string().default('/auth/login'),
  VITE_CLERK_SIGN_UP_URL: z.string().default('/auth/register'),
  VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().default('/applications'),
  VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().default('/onboarding'),
});

export function validateServerEnv(): z.infer<typeof serverEnvSchema> {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(`Invalid server environment variables:\n${formatted}`);
  }
  return result.data;
}

export function validateClientEnv(env: Record<string, unknown>): z.infer<typeof clientEnvSchema> {
  const result = clientEnvSchema.safeParse(env);
  if (!result.success) {
    const formatted = result.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(`Invalid client environment variables:\n${formatted}`);
  }
  return result.data;
}
