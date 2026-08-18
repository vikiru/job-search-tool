import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { auth } from '@clerk/tanstack-react-start/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { success, error, type Result } from '@/shared/lib/result';
import type { SelectUser } from '@/server/db/zod';
import { logServerError } from '@/server/lib/log-error';

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
  .validator((data: unknown) => userProfileSchema.parse(data))
  .handler(async ({ data }): Promise<Result<{ id: string }>> => {
    const { userId } = await auth();
    if (!userId) {
      return error('Unauthorized');
    }

    try {
      await db
        .insert(users)
        .values({
          id: userId,
          email: data.email ?? null,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber ?? null,
          location: data.location ?? null,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: data.email ?? null,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber ?? null,
            location: data.location ?? null,
            updatedAt: new Date(),
          },
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
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user ?? null;
  } catch (cause) {
    logServerError('auth:get-profile', cause);
    return null;
  }
});
