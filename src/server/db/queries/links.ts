import { and, eq, desc } from 'drizzle-orm';
import { db } from '@/server/db';
import { applicationLinks, applications } from '@/server/db/schema';
import type { SelectApplicationLink } from '@/server/db/zod';

export async function findLinksByApplicationId(
  applicationId: string,
  userId: string,
): Promise<SelectApplicationLink[]> {
  const [app] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)));

  if (!app) {
    return [];
  }

  return db
    .select()
    .from(applicationLinks)
    .where(eq(applicationLinks.applicationId, applicationId))
    .orderBy(desc(applicationLinks.createdAt));
}

export async function insertLink(
  applicationId: string,
  url: string,
  label: string | null,
  userId: string,
): Promise<SelectApplicationLink | undefined> {
  const [app] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)));

  if (!app) {
    return undefined;
  }

  const [link] = await db
    .insert(applicationLinks)
    .values({
      applicationId,
      url,
      label,
    })
    .returning();
  return link;
}

export async function deleteLink(id: string, userId: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: applicationLinks.id })
    .from(applicationLinks)
    .innerJoin(applications, eq(applicationLinks.applicationId, applications.id))
    .where(and(eq(applicationLinks.id, id), eq(applications.userId, userId)));

  if (!existing) {
    return false;
  }

  const [deleted] = await db
    .delete(applicationLinks)
    .where(eq(applicationLinks.id, id))
    .returning({ id: applicationLinks.id });
  return Boolean(deleted);
}
