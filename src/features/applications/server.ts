import { createServerFn } from '@tanstack/react-start';
import { auth } from '@clerk/tanstack-react-start/server';
import { z } from 'zod';

import {
  applicationResourceSchema,
  createApplicationSchema,
  linkMutationSchema,
  linkUpdateSchema,
  noteMutationSchema,
  noteUpdateSchema,
  recentActivitySchema,
  statusUpdateSchema,
  updateApplicationSchema,
} from '@/features/applications/application-schemas';
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
import { error, success, type Result } from '@/shared/lib/result';
import type { ApplicationDetail, ApplicationListItem, RecentApplicationActivity } from '@/features/applications/types';
import { logServerError } from '@/server/lib/log-error';

export type { CreateApplicationInput, UpdateApplicationInput } from '@/features/applications/application-schemas';

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
    } catch (cause) {
      logServerError('applications:list', cause);
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
    } catch (cause) {
      logServerError('applications:get', cause);
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
    } catch (cause) {
      logServerError('applications:create', cause);
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
    } catch (cause) {
      logServerError('applications:update', cause);
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
    } catch (cause) {
      logServerError('applications:update-status', cause);
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
    } catch (cause) {
      logServerError('applications:delete', cause);
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
    } catch (cause) {
      logServerError('applications:add-note', cause);
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
    } catch (cause) {
      logServerError('applications:update-note', cause);
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
    } catch (cause) {
      logServerError('applications:delete-note', cause);
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
    } catch (cause) {
      logServerError('applications:add-link', cause);
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
    } catch (cause) {
      logServerError('applications:update-link', cause);
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
    } catch (cause) {
      logServerError('applications:delete-link', cause);
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
    } catch (cause) {
      logServerError('applications:recent-activity', cause);
      return error('We could not load recent activity.');
    }
  });
