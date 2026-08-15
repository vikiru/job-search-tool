import { and, eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { applicationAnalysis, applications } from '@/server/db/schema';
import type { InsertApplicationAnalysis, SelectApplicationAnalysis } from '@/server/db/zod';

export async function findAnalysisByApplicationId(
  applicationId: string,
  userId: string,
): Promise<SelectApplicationAnalysis | undefined> {
  const [app] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)));

  if (!app) {
    return undefined;
  }

  const [analysis] = await db
    .select()
    .from(applicationAnalysis)
    .where(eq(applicationAnalysis.applicationId, applicationId));
  return analysis;
}

export async function upsertAnalysis(
  applicationId: string,
  data: Partial<Omit<InsertApplicationAnalysis, 'id' | 'applicationId' | 'createdAt' | 'updatedAt'>>,
  userId: string,
): Promise<SelectApplicationAnalysis | undefined> {
  const [app] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)));

  if (!app) {
    return undefined;
  }

  const [upserted] = await db
    .insert(applicationAnalysis)
    .values({
      ...data,
      applicationId,
    })
    .onConflictDoUpdate({
      target: applicationAnalysis.applicationId,
      set: {
        ...data,
        updatedAt: new Date(),
      },
    })
    .returning();
  return upserted;
}
