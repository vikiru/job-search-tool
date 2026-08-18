import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { resumes } from '@/server/db/schema';
import type { SelectResume } from '@/server/db/zod';

export async function findResumeByUserId(userId: string): Promise<SelectResume | undefined> {
  const [resume] = await db.select().from(resumes).where(eq(resumes.userId, userId));
  return resume;
}

export async function upsertResume(userId: string, filename: string, extractedText: string): Promise<SelectResume> {
  const [upserted] = await db
    .insert(resumes)
    .values({
      userId,
      filename,
      extractedText,
    })
    .onConflictDoUpdate({
      target: resumes.userId,
      set: {
        filename,
        extractedText,
        updatedAt: new Date(),
      },
    })
    .returning();
  return upserted;
}

export async function updateResumeText(userId: string, extractedText: string): Promise<SelectResume | undefined> {
  const [updated] = await db
    .update(resumes)
    .set({ extractedText, updatedAt: new Date() })
    .where(eq(resumes.userId, userId))
    .returning();
  return updated;
}

export async function deleteResume(userId: string): Promise<boolean> {
  const [deleted] = await db.delete(resumes).where(eq(resumes.userId, userId)).returning({ id: resumes.id });
  return Boolean(deleted);
}
