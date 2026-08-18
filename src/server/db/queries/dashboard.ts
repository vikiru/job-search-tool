import { and, asc, eq, gte, lte, sql } from 'drizzle-orm';

import type { ApplicationStatus } from '@/server/db/zod';

import { db } from '@/server/db';
import { applications } from '@/server/db/schema';

export interface DashboardStats {
  activePipeline: number;
  ghosted: number;
  interviews: number;
  offers: number;
  rejected: number;
  responseRate: number;
  total: number;
}

export interface DashboardStatusCount {
  count: number;
  status: ApplicationStatus;
}

export interface DashboardWeeklyActivity {
  applicationDate: string;
  count: number;
}

export async function findDashboardStats(userId: string): Promise<DashboardStats> {
  const [stats] = await db
    .select({
      activePipeline: sql<number>`count(*) filter (where ${applications.status} in ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER'))::int`,
      ghosted: sql<number>`count(*) filter (where ${applications.status} = 'GHOSTED')::int`,
      interviews: sql<number>`count(*) filter (where ${applications.status} = 'INTERVIEW')::int`,
      offers: sql<number>`count(*) filter (where ${applications.status} = 'OFFER')::int`,
      rejected: sql<number>`count(*) filter (where ${applications.status} = 'REJECTED')::int`,
      responseRate: sql<number>`coalesce(round(100.0 * count(*) filter (where ${applications.status} in ('SCREENING', 'INTERVIEW', 'OFFER')) / nullif(count(*), 0)), 0)::int`,
      total: sql<number>`count(*)::int`,
    })
    .from(applications)
    .where(eq(applications.userId, userId));

  return stats;
}

export async function findDashboardStatusCounts(userId: string): Promise<DashboardStatusCount[]> {
  return db
    .select({
      count: sql<number>`count(*)::int`,
      status: applications.status,
    })
    .from(applications)
    .where(eq(applications.userId, userId))
    .groupBy(applications.status)
    .orderBy(asc(applications.status));
}

export async function findDashboardWeeklyActivity(
  userId: string,
  weekStart: string,
  weekEnd: string,
): Promise<DashboardWeeklyActivity[]> {
  return db
    .select({
      applicationDate: applications.applicationDate,
      count: sql<number>`count(*)::int`,
    })
    .from(applications)
    .where(
      and(
        eq(applications.userId, userId),
        gte(applications.applicationDate, weekStart),
        lte(applications.applicationDate, weekEnd),
      ),
    )
    .groupBy(applications.applicationDate)
    .orderBy(asc(applications.applicationDate));
}
