import { auth } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import { findDashboardOverview } from '@/server/db/queries/dashboard';
import { logServerError } from '@/server/lib/log-error';
import { error, success, type Result } from '@/shared/lib/result';

const weekSchema = z.object({ weekStart: z.string().date(), weekEnd: z.string().date() });

async function getUserId() {
  return (await auth()).userId;
}

export const getDashboardOverview = createServerFn({ method: 'GET' })
  .validator((input: unknown) => weekSchema.parse(input))
  .handler(async ({ data }): Promise<Result<Awaited<ReturnType<typeof findDashboardOverview>>>> => {
    try {
      const userId = await getUserId();
      if (!userId) return error('Unauthorized');
      return success(await findDashboardOverview(userId, data.weekStart, data.weekEnd));
    } catch (cause) {
      logServerError('dashboard:overview', cause);
      return error('We could not load your dashboard overview.');
    }
  });
