import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getResume, removeResume, saveResumeText, uploadResume } from '@/features/resumes/server';
import type { SelectResume } from '@/server/db/zod';
import { error } from '@/shared/lib/result';

export const resumeKeys = {
  all: (userId: string) => ['resumes', userId] as const,
};

export function resumesQueryOptions(userId: string) {
  return queryOptions({
    queryKey: resumeKeys.all(userId),
    queryFn: getResume,
  });
}

export function useResumes(userId: string) {
  return useQuery(resumesQueryOptions(userId));
}

async function fileToBase64(file: File): Promise<string> {
  return file.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }

    return btoa(binary);
  });
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
