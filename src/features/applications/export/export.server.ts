import { auth } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';

import type { ExportPayload } from '@/features/applications/export/types';

import { exportRequestSchema } from '@/features/applications/export/export.schema';
import { findApplicationsWithAnalysis } from '@/server/db/queries/applications';
import { findLinksByUserId } from '@/server/db/queries/links';
import { findNotesByUserId } from '@/server/db/queries/notes';
import { logServerError } from '@/server/lib/log-error';
import { error, success, type Result } from '@/shared/lib/result';

export const exportApplications = createServerFn({ method: 'GET' })
  .validator((input: unknown) => exportRequestSchema.safeParse(input))
  .handler(async ({ data }): Promise<Result<ExportPayload>> => {
    if (!data.success) return error('Invalid export format.');

    const { userId } = await auth();
    if (!userId) return error('Unauthorized');

    try {
      const [applicationRows, notes, links] = await Promise.all([
        findApplicationsWithAnalysis(userId),
        findNotesByUserId(userId),
        findLinksByUserId(userId),
      ]);
      const notesByApplicationId = new Map<string, typeof notes>();
      const linksByApplicationId = new Map<string, typeof links>();

      for (const note of notes) {
        const items = notesByApplicationId.get(note.applicationId) ?? [];
        items.push(note);
        notesByApplicationId.set(note.applicationId, items);
      }

      for (const link of links) {
        const items = linksByApplicationId.get(link.applicationId) ?? [];
        items.push(link);
        linksByApplicationId.set(link.applicationId, items);
      }

      return success({
        applications: applicationRows.map(({ application, analysis }) => ({
          ...application,
          analysis,
          links: linksByApplicationId.get(application.id) ?? [],
          notes: notesByApplicationId.get(application.id) ?? [],
        })),
      });
    } catch (cause) {
      logServerError('applications:export', cause);
      return error('We could not export your applications.');
    }
  });
