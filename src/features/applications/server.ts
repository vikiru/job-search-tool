import { createServerFn } from '@tanstack/react-start';
import { auth } from '@clerk/tanstack-react-start/server';
import { z } from 'zod';

import { getOrCreateUser } from '@/server/db/users';
import { findApplicationActivity, findRecentApplicationActivity } from '@/server/db/queries/activity';
import {
  findApplicationById,
  findApplicationsWithAnalysis,
  insertApplicationWithActivity,
  updateApplication,
  updateApplicationStatusWithActivity,
  deleteApplication as deleteApplicationQuery,
} from '@/server/db/queries/applications';
import { findAnalysisByApplicationId } from '@/server/db/queries/analysis';
import { deleteLink, findLinksByApplicationId, insertLink, updateLink } from '@/server/db/queries/links';
import { deleteNote, findNotesByApplicationId, insertNote, updateNote } from '@/server/db/queries/notes';
import { ApplicationStatusSchema, WorkArrangementSchema, SalaryPeriodSchema } from '@/server/db/zod';
import { error, success, type Result } from '@/shared/lib/result';
import type { ApplicationDetail, ApplicationListItem, RecentApplicationActivity } from '@/features/applications/types';

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

const optionalUrl = z.string().trim().url('Enter a valid URL.').or(z.literal('')).nullable().optional();

const optionalNumeric = (max?: number) => {
  const schema = z.number().finite().nonnegative();
  return (max ? schema.max(max) : schema).transform(String).nullable().optional();
};

const applicationFields = {
  company: z.string().trim().min(1, 'Company is required.').max(200),
  position: z.string().trim().min(1, 'Role is required.').max(200),
  status: ApplicationStatusSchema.default('SAVED'),
  interestRating: z.number().int().min(1).max(5).nullable().optional(),
  location: optionalText(200),
  workArrangement: WorkArrangementSchema.nullable().optional(),
  employmentType: optionalText(100),
  salaryMin: optionalNumeric(),
  salaryMax: optionalNumeric(),
  salaryCurrency: optionalText(10),
  salaryPeriod: SalaryPeriodSchema.nullable().optional(),
  hoursPerWeek: z.number().finite().positive().max(168).transform(String).nullable().optional(),
  requisitionNumber: optionalText(100),
  applicationInstructions: z.array(z.string().trim().min(1).max(500)).max(50).nullable().optional(),
  applicationUrl: optionalUrl,
  applicationDate: z.string().date().optional(),
  source: optionalText(100),
  jobDescriptionMd: z.string().trim().min(1, 'Job description is required.').max(200_000),
};

const createApplicationSchema = z.object(applicationFields);
const updateApplicationSchema = z.object({
  id: z.string().uuid(),
  data: z
    .object({
      ...applicationFields,
      company: applicationFields.company.optional(),
      position: applicationFields.position.optional(),
      status: applicationFields.status.optional(),
      jobDescriptionMd: applicationFields.jobDescriptionMd.optional(),
    })
    .partial(),
});
const statusUpdateSchema = z.object({ id: z.string().uuid(), status: ApplicationStatusSchema });
const applicationResourceSchema = z.object({ id: z.string().uuid() });
const noteMutationSchema = z.object({
  applicationId: z.string().uuid(),
  content: z.string().trim().min(1).max(20_000),
});
const noteUpdateSchema = z.object({ id: z.string().uuid(), content: z.string().trim().min(1).max(20_000) });
const linkMutationSchema = z.object({
  applicationId: z.string().uuid(),
  url: z.string().trim().url(),
  label: optionalText(100),
});
const linkUpdateSchema = z.object({ id: z.string().uuid(), url: z.string().trim().url(), label: optionalText(100) });
const recentActivitySchema = z.object({ limit: z.number().int().min(1).max(50).default(10) });

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

function validateInput<T extends z.ZodTypeAny>(schema: T) {
  return (input: unknown): Result<z.infer<T>> => {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return error(
        'Invalid application input.',
        parsed.error.issues.map((issue) => issue.message),
      );
    }

    return success(parsed.data);
  };
}

function requireUserId() {
  return auth().then(({ userId }) => userId);
}

function nullableFields<T extends Record<string, unknown>>(data: T): T {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])) as T;
}

export const listApplications = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Result<ApplicationListItem[]>> => {
    try {
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');

      const rows = await findApplicationsWithAnalysis(userId);
      return success(rows.map(({ application, analysis }) => ({ ...application, analysis })));
    } catch {
      return error('We could not load your applications.');
    }
  },
);

export const getApplication = createServerFn({ method: 'GET' })
  .validator(validateInput(applicationResourceSchema))
  .handler(async ({ data }): Promise<Result<ApplicationDetail>> => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');

      const application = await findApplicationById(data.data.id, userId);
      if (!application) return error('Application not found.');

      const [links, notes, analysis, activity] = await Promise.all([
        findLinksByApplicationId(application.id, userId),
        findNotesByApplicationId(application.id, userId),
        findAnalysisByApplicationId(application.id, userId),
        findApplicationActivity(application.id, userId),
      ]);

      return success({ ...application, activity, analysis: analysis ?? null, links, notes });
    } catch {
      return error('We could not load this application.');
    }
  });

export const createApplication = createServerFn({ method: 'POST' })
  .validator(validateInput(createApplicationSchema))
  .handler(async ({ data }): Promise<Result<{ id: string }>> => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');

      await getOrCreateUser(userId);
      const application = await insertApplicationWithActivity(nullableFields(data.data), userId);
      return success({ id: application.id });
    } catch {
      return error('We could not save this application.');
    }
  });

export const updateApplicationMutation = createServerFn({ method: 'POST' })
  .validator(validateInput(updateApplicationSchema))
  .handler(async ({ data }): Promise<Result<ApplicationDetail>> => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');

      const updated = await updateApplication(data.data.id, nullableFields(data.data.data), userId);
      if (!updated) return error('Application not found.');
      return getApplication({ data: { id: updated.id } });
    } catch {
      return error('We could not update this application.');
    }
  });

export const updateApplicationStatus = createServerFn({ method: 'POST' })
  .validator(validateInput(statusUpdateSchema))
  .handler(async ({ data }): Promise<Result<ApplicationDetail>> => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');

      const updated = await updateApplicationStatusWithActivity(data.data.id, data.data.status, userId);
      if (!updated) return error('Application not found.');
      return getApplication({ data: { id: updated.id } });
    } catch {
      return error('We could not change the application status.');
    }
  });

export const deleteApplication = createServerFn({ method: 'POST' })
  .validator(validateInput(applicationResourceSchema))
  .handler(async ({ data }): Promise<Result<null>> => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');

      const deleted = await deleteApplicationQuery(data.data.id, userId);
      return deleted ? success(null) : error('Application not found.');
    } catch {
      return error('We could not delete this application.');
    }
  });

export const addApplicationNote = createServerFn({ method: 'POST' })
  .validator(validateInput(noteMutationSchema))
  .handler(async ({ data }) => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');
      const note = await insertNote(data.data.applicationId, data.data.content, userId);
      return note ? success(note) : error('Application not found.');
    } catch {
      return error('We could not add this note.');
    }
  });

export const updateApplicationNote = createServerFn({ method: 'POST' })
  .validator(validateInput(noteUpdateSchema))
  .handler(async ({ data }) => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');
      const note = await updateNote(data.data.id, data.data.content, userId);
      return note ? success(note) : error('Note not found.');
    } catch {
      return error('We could not update this note.');
    }
  });

export const deleteApplicationNote = createServerFn({ method: 'POST' })
  .validator(validateInput(applicationResourceSchema))
  .handler(async ({ data }) => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');
      return (await deleteNote(data.data.id, userId)) ? success(null) : error('Note not found.');
    } catch {
      return error('We could not delete this note.');
    }
  });

export const addApplicationLink = createServerFn({ method: 'POST' })
  .validator(validateInput(linkMutationSchema))
  .handler(async ({ data }) => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');
      const link = await insertLink(data.data.applicationId, data.data.url, data.data.label ?? null, userId);
      return link ? success(link) : error('Application not found.');
    } catch {
      return error('We could not add this link.');
    }
  });

export const updateApplicationLink = createServerFn({ method: 'POST' })
  .validator(validateInput(linkUpdateSchema))
  .handler(async ({ data }) => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');
      const link = await updateLink(data.data.id, { url: data.data.url, label: data.data.label ?? null }, userId);
      return link ? success(link) : error('Link not found.');
    } catch {
      return error('We could not update this link.');
    }
  });

export const deleteApplicationLink = createServerFn({ method: 'POST' })
  .validator(validateInput(applicationResourceSchema))
  .handler(async ({ data }) => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');
      return (await deleteLink(data.data.id, userId)) ? success(null) : error('Link not found.');
    } catch {
      return error('We could not delete this link.');
    }
  });

export const getRecentApplicationActivity = createServerFn({ method: 'GET' })
  .validator(validateInput(recentActivitySchema))
  .handler(async ({ data }): Promise<Result<RecentApplicationActivity[]>> => {
    try {
      if (!data.success) return data;
      const userId = await requireUserId();
      if (!userId) return error('Unauthorized');
      return success(await findRecentApplicationActivity(userId, data.data.limit));
    } catch {
      return error('We could not load recent activity.');
    }
  });
