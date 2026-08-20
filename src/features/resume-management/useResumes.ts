import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { SelectResume } from '@/server/db/zod';

import { resumeKeys } from '@/features/resume-management/resume-keys';
import { getResume, removeResume, saveResumeText, uploadResume } from '@/features/resume-management/server';
import { fileToBase64 } from '@/shared/lib/files';
import { error } from '@/shared/lib/result';

export function resumesQueryOptions(userId: string) {
  return queryOptions({
    queryKey: resumeKeys.all(userId),
    queryFn: getResume,
  });
}

export function useResumes(userId: string) {
  return useQuery(resumesQueryOptions(userId));
}

export function useUploadResume(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        return await uploadResume({
          data: {
            filename: file.name,
            fileSize: file.size,
            mimeType: 'application/pdf',
            pdfBase64: await fileToBase64(file),
          },
        });
      } catch {
        return error('We could not upload your resume.');
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumeKeys.all(userId) }),
  });
}

export function useSaveResumeText(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (extractedText: string) => {
      try {
        return await saveResumeText({ data: { extractedText } });
      } catch {
        return error('We could not save your resume text.');
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumeKeys.all(userId) }),
  });
}

export function useRemoveResume(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        return await removeResume();
      } catch {
        return error('We could not remove your resume.');
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumeKeys.all(userId) }),
  });
}

export type ResumeData = SelectResume;
