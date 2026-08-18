import { eq } from 'drizzle-orm';

import type { UserContactUpdate } from '@/features/profile/types';
import type { SelectUser, SelectUserLink } from '@/server/db/zod';

import { db } from '@/server/db';
import { userLinks, users } from '@/server/db/schema';

export async function findUserContactById(userId: string): Promise<{
  email: string | null;
  links: SelectUserLink[];
  phoneNumber: string | null;
} | null> {
  const [user] = await db
    .select({ email: users.email, phoneNumber: users.phoneNumber })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) return null;

  const links = await db.select().from(userLinks).where(eq(userLinks.userId, userId)).orderBy(userLinks.createdAt);

  return { ...user, links };
}

export async function updateUserContact(
  userId: string,
  data: Omit<UserContactUpdate, 'email' | 'phoneNumber'> & {
    email: string | null;
    phoneNumber: string | null;
  },
): Promise<SelectUser | null> {
  return db.transaction(async (tx) => {
    const [user] = await tx
      .update(users)
      .set({ email: data.email, phoneNumber: data.phoneNumber, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!user) return null;

    await tx.delete(userLinks).where(eq(userLinks.userId, userId));
    if (data.links.length > 0) {
      await tx.insert(userLinks).values(
        data.links.map((link) => ({
          label: link.label,
          url: link.href,
          userId,
        })),
      );
    }

    return user;
  });
}
