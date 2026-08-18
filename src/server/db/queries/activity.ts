import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { applicationActivity, applications } from '@/server/db/schema';
import type { SelectApplicationActivity } from '@/server/db/zod';

export async function findApplicationActivity(
  applicationId: string,
  userId: string,
): Promise<SelectApplicationActivity[]> {
  const [ownedApplication] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)));

  if (!ownedApplication) return [];

  return db
    .select()
    .from(applicationActivity)
    .where(and(eq(applicationActivity.applicationId, applicationId), eq(applicationActivity.userId, userId)))
    .orderBy(desc(applicationActivity.createdAt));
}

export async function findRecentApplicationActivity(userId: string, limit = 10) {
  return db
    .select({
      activity: applicationActivity,
      company: applications.company,
      position: applications.position,
    })
    .from(applicationActivity)
    .innerJoin(applications, eq(applicationActivity.applicationId, applications.id))
    .where(eq(applicationActivity.userId, userId))
    .orderBy(desc(applicationActivity.createdAt))
    .limit(limit);
}
