import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { applicationActivity, applicationAnalysis, applications } from '@/server/db/schema';
import type {
  ApplicationStatus,
  InsertApplication,
  SelectApplication,
  SelectApplicationAnalysis,
} from '@/server/db/zod';

export interface ApplicationListRow {
  application: SelectApplication;
  analysis: SelectApplicationAnalysis | null;
}

export async function findApplicationById(id: string, userId: string): Promise<SelectApplication | undefined> {
  const [result] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)));
  return result;
}

export async function findApplications(userId: string, status?: ApplicationStatus): Promise<SelectApplication[]> {
  const conditions = [eq(applications.userId, userId)];
  if (status) {
    conditions.push(eq(applications.status, status));
  }

  return db
    .select()
    .from(applications)
    .where(and(...conditions))
    .orderBy(desc(applications.createdAt));
}

export async function findApplicationsWithAnalysis(userId: string): Promise<ApplicationListRow[]> {
  const rows = await db
    .select({ application: applications, analysis: applicationAnalysis })
    .from(applications)
    .leftJoin(applicationAnalysis, eq(applicationAnalysis.applicationId, applications.id))
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.createdAt));

  return rows;
}

export async function insertApplication(
  data: Omit<InsertApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  userId: string,
): Promise<SelectApplication> {
  const [created] = await db
    .insert(applications)
    .values({
      ...data,
      userId,
    })
    .returning();
  return created;
}

export async function insertApplicationWithActivity(
  data: Omit<InsertApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  userId: string,
): Promise<SelectApplication> {
  return db.transaction(async (tx) => {
    const [created] = await tx
      .insert(applications)
      .values({ ...data, userId })
      .returning();

    await tx.insert(applicationActivity).values({
      applicationId: created.id,
      eventType: 'APPLICATION_CREATED',
      userId,
    });

    return created;
  });
}

export async function updateApplication(
  id: string,
  data: Partial<Omit<InsertApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>,
  userId: string,
): Promise<SelectApplication | undefined> {
  const [updated] = await db
    .update(applications)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))
    .returning();
  return updated;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  userId: string,
): Promise<SelectApplication | undefined> {
  const [updated] = await db
    .update(applications)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))
    .returning();
  return updated;
}

export async function updateApplicationStatusWithActivity(
  id: string,
  status: ApplicationStatus,
  userId: string,
): Promise<SelectApplication | undefined> {
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ status: applications.status })
      .from(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)));

    if (!existing) return undefined;

    const [updated] = await tx
      .update(applications)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(applications.id, id), eq(applications.userId, userId)))
      .returning();

    if (existing.status !== status) {
      await tx.insert(applicationActivity).values({
        applicationId: id,
        eventType: 'STATUS_CHANGED',
        previousStatus: existing.status,
        nextStatus: status,
        userId,
      });
    }

    return updated;
  });
}

export async function updateApplicationInterest(
  id: string,
  interestRating: number,
  userId: string,
): Promise<SelectApplication | undefined> {
  const [updated] = await db
    .update(applications)
    .set({
      interestRating,
      updatedAt: new Date(),
    })
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))
    .returning();
  return updated;
}

export async function deleteApplication(id: string, userId: string): Promise<boolean> {
  const [deleted] = await db
    .delete(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))
    .returning({ id: applications.id });
  return Boolean(deleted);
}
