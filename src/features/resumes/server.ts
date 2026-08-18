import { createServerFn } from '@tanstack/react-start';
import { auth } from '@clerk/tanstack-react-start/server';
import { z, type ZodType } from 'zod';

import { deleteResume, findResumeByUserId, updateResumeText, upsertResume } from '@/server/db/queries/resumes';
import { parseResumePdf } from '@/server/resumes/parse-pdf';
import { MAX_RESUME_FILE_SIZE } from '@/features/resumes/constants';
import { error, success, type Result } from '@/shared/lib/result';
import type { SelectResume } from '@/server/db/zod';

const uploadResumeSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  fileSize: z.number().int().positive().max(MAX_RESUME_FILE_SIZE),
  mimeType: z.literal('application/pdf'),
  pdfBase64: z.string().min(1),
});

const updateResumeTextSchema = z.object({
  extractedText: z.string().trim().min(1, 'Resume text cannot be empty.').max(200_000),
});

function validateInput<T>(schema: ZodType<T>) {
  return (input: unknown): Result<T> => {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return error(
        'Invalid resume input.',
        parsed.error.issues.map((issue) => issue.message),
      );
    }

    return success(parsed.data);
  };
}

export const getResume = createServerFn({ method: 'GET' }).handler(async (): Promise<Result<SelectResume | null>> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return error('Unauthorized');
    }

    return success((await findResumeByUserId(userId)) ?? null);
  } catch {
    return error('We could not load your resume.');
  }
});

export const uploadResume = createServerFn({ method: 'POST' })
  .validator(validateInput(uploadResumeSchema))
  .handler(async ({ data }): Promise<Result<SelectResume>> => {
    try {
      if (!data.success) {
        return data;
      }

      const { userId } = await auth();
      if (!userId) {
        return error('Unauthorized');
      }

      const pdfBuffer = Buffer.from(data.data.pdfBase64, 'base64');
      const parsedResume = await parseResumePdf(pdfBuffer);
      if (!parsedResume.success) {
        return parsedResume;
      }

      const resume = await upsertResume(userId, data.data.filename, parsedResume.data);

      return success(resume);
    } catch (cause) {
      return error(cause instanceof Error ? cause.message : 'We could not process that resume.');
    }
  });

export const saveResumeText = createServerFn({ method: 'POST' })
  .validator(validateInput(updateResumeTextSchema))
  .handler(async ({ data }): Promise<Result<SelectResume>> => {
    try {
      if (!data.success) {
        return data;
      }

      const { userId } = await auth();
      if (!userId) {
        return error('Unauthorized');
      }

      const resume = await updateResumeText(userId, data.data.extractedText);
      return resume ? success(resume) : error('Resume not found.');
    } catch {
      return error('We could not save your resume text.');
    }
  });

export const removeResume = createServerFn({ method: 'POST' }).handler(async (): Promise<Result<null>> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return error('Unauthorized');
    }

    await deleteResume(userId);
    return success(null);
  } catch {
    return error('We could not remove your resume.');
  }
});
