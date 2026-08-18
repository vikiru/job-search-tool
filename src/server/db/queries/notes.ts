import { and, eq, desc } from 'drizzle-orm';
import { db } from '@/server/db';
import { applicationNotes, applications } from '@/server/db/schema';
import type { SelectApplicationNote } from '@/server/db/zod';

export async function findNotesByApplicationId(
  applicationId: string,
  userId: string,
): Promise<SelectApplicationNote[]> {
  const [app] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)));

  if (!app) {
    return [];
  }

  return db
    .select()
    .from(applicationNotes)
    .where(eq(applicationNotes.applicationId, applicationId))
    .orderBy(desc(applicationNotes.createdAt));
}

export async function findNotesByUserId(userId: string): Promise<SelectApplicationNote[]> {
  return db
    .select({ note: applicationNotes })
    .from(applicationNotes)
    .innerJoin(applications, eq(applicationNotes.applicationId, applications.id))
    .where(eq(applications.userId, userId))
    .orderBy(desc(applicationNotes.createdAt))
    .then((rows) => rows.map(({ note }) => note));
}

export async function insertNote(
  applicationId: string,
  content: string,
  userId: string,
): Promise<SelectApplicationNote | undefined> {
  const [app] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)));

  if (!app) {
    return undefined;
  }

  const [note] = await db
    .insert(applicationNotes)
    .values({
      applicationId,
      content,
    })
    .returning();
  return note;
}

export async function updateNote(
  id: string,
  content: string,
  userId: string,
): Promise<SelectApplicationNote | undefined> {
  const [existing] = await db
    .select({ id: applicationNotes.id })
    .from(applicationNotes)
    .innerJoin(applications, eq(applicationNotes.applicationId, applications.id))
    .where(and(eq(applicationNotes.id, id), eq(applications.userId, userId)));

  if (!existing) {
    return undefined;
  }

  const [updated] = await db
    .update(applicationNotes)
    .set({
      content,
      updatedAt: new Date(),
    })
    .where(eq(applicationNotes.id, id))
    .returning();
  return updated;
}

export async function deleteNote(id: string, userId: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: applicationNotes.id })
    .from(applicationNotes)
    .innerJoin(applications, eq(applicationNotes.applicationId, applications.id))
    .where(and(eq(applicationNotes.id, id), eq(applications.userId, userId)));

  if (!existing) {
    return false;
  }

  const [deleted] = await db
    .delete(applicationNotes)
    .where(eq(applicationNotes.id, id))
    .returning({ id: applicationNotes.id });
  return Boolean(deleted);
}
