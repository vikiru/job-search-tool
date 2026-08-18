import { eq } from 'drizzle-orm';

import type { InsertUser, SelectUser } from '@/server/db/zod';

import { db } from '@/server/db';
import { users } from '@/server/db/schema';

export async function getOrCreateUser(
  userId: string,
  profileData?: Partial<Omit<InsertUser, 'id'>>,
): Promise<SelectUser> {
  const existing = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(users)
    .values({
      id: userId,
      email: profileData?.email ?? null,
      firstName: profileData?.firstName ?? null,
      lastName: profileData?.lastName ?? null,
      phoneNumber: profileData?.phoneNumber ?? null,
      location: profileData?.location ?? null,
    })
    .returning();

  return created;
}
