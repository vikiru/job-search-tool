import { auth } from '@clerk/tanstack-react-start/server';
import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import type { SelectUser } from '@/server/db/zod';

import { findUserProfile, upsertUserProfile } from '@/server/db/queries/users';
import { logServerError } from '@/server/lib/log-error';
import { success, error, type Result } from '@/shared/lib/result';

export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

export const requireAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId, sessionId } = await auth();

  if (!userId) {
    throw redirect({
      to: '/auth/login',
    });
  }

  return { userId, sessionId };
});

export const saveUserProfile = createServerFn({ method: 'POST' })
  .validator((data: unknown): Result<UserProfileInput> => {
    const parsed = userProfileSchema.safeParse(data);
    return parsed.success ? success(parsed.data) : error('Invalid profile input.');
  })
  .handler(async ({ data }): Promise<Result<{ id: string }>> => {
    if (!data.success) return data;
    const { userId } = await auth();
    if (!userId) {
      return error('Unauthorized');
    }

    try {
      await upsertUserProfile(userId, {
        email: data.data.email ?? null,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        phoneNumber: data.data.phoneNumber ?? null,
        location: data.data.location ?? null,
      });
    } catch (cause) {
      logServerError('auth:save-profile', cause);
      return error('We could not save your profile.');
    }

    return success({ id: userId });
  });

export const getUserProfile = createServerFn({ method: 'GET' }).handler(async (): Promise<SelectUser | null> => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  try {
    return await findUserProfile(userId);
  } catch (cause) {
    logServerError('auth:get-profile', cause);
    return null;
  }
});
