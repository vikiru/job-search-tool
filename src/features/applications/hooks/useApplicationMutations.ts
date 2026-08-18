import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addApplicationLink,
  addApplicationNote,
  createApplication,
  deleteApplication,
  deleteApplicationLink,
  deleteApplicationNote,
  updateApplicationLink,
  updateApplicationMutation,
  updateApplicationNote,
  updateApplicationStatus,
} from '@/features/applications/server';
import type { CreateApplicationInput, UpdateApplicationInput } from '@/features/applications/server';
import { applicationKeys } from '@/features/applications/hooks/useApplications';
import { dashboardKeys } from '@/features/dashboard/hooks/useDashboard';
import type { ApplicationDetail } from '@/features/applications/types';
import type { ApplicationStatus } from '@/server/db/zod';
import { error, type Result } from '@/shared/lib/result';

type ApplicationMutationResult = Result<ApplicationDetail>;

async function withFallback<T>(operation: () => Promise<Result<T>>, message: string): Promise<Result<T>> {
  try {
    return await operation();
  } catch {
    return error(message);
  }
}

function invalidateApplicationQueries(queryClient: ReturnType<typeof useQueryClient>, userId: string, id?: string) {
  void queryClient.invalidateQueries({ queryKey: applicationKeys.all(userId) });
  void queryClient.invalidateQueries({ queryKey: dashboardKeys.all(userId) });
  if (id) void queryClient.invalidateQueries({ queryKey: applicationKeys.detail(userId, id) });
}

export function useCreateApplication(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationInput) =>
      withFallback(() => createApplication({ data }), 'We could not save this application.'),
    onSuccess: (result) => {
      if (result.success) invalidateApplicationQueries(queryClient, userId);
    },
  });
}

export function useUpdateApplication(userId: string, id: string) {
  const queryClient = useQueryClient();

  return useMutation<Result<ApplicationDetail>, Error, UpdateApplicationInput>({
    mutationFn: (data) =>
      withFallback(() => updateApplicationMutation({ data }), 'We could not update this application.'),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.setQueryData(applicationKeys.detail(userId, id), result);
        invalidateApplicationQueries(queryClient, userId, id);
      }
    },
  });
}

export function useUpdateApplicationStatus(userId: string, id: string) {
  const queryClient = useQueryClient();

  return useMutation<ApplicationMutationResult, Error, ApplicationStatus>({
    mutationFn: (status) =>
      withFallback(
        () => updateApplicationStatus({ data: { id, status } }),
        'We could not change the application status.',
      ),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.setQueryData(applicationKeys.detail(userId, id), result);
        invalidateApplicationQueries(queryClient, userId, id);
      }
    },
  });
}

export function useDeleteApplication(userId: string, id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => withFallback(() => deleteApplication({ data: { id } }), 'We could not delete this application.'),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.removeQueries({ queryKey: applicationKeys.detail(userId, id) });
        invalidateApplicationQueries(queryClient, userId);
      }
    },
  });
}

export function useApplicationNotes(userId: string, applicationId: string) {
  const queryClient = useQueryClient();

  return {
    add: useMutation({
      mutationFn: (content: string) =>
        withFallback(() => addApplicationNote({ data: { applicationId, content } }), 'We could not add this note.'),
      onSuccess: () => invalidateApplicationQueries(queryClient, userId, applicationId),
    }),
    update: useMutation({
      mutationFn: (data: { id: string; content: string }) =>
        withFallback(() => updateApplicationNote({ data }), 'We could not update this note.'),
      onSuccess: () => invalidateApplicationQueries(queryClient, userId, applicationId),
    }),
    remove: useMutation({
      mutationFn: (id: string) =>
        withFallback(() => deleteApplicationNote({ data: { id } }), 'We could not delete this note.'),
      onSuccess: () => invalidateApplicationQueries(queryClient, userId, applicationId),
    }),
  };
}

export function useApplicationLinks(userId: string, applicationId: string) {
  const queryClient = useQueryClient();

  return {
    add: useMutation({
      mutationFn: (data: { url: string; label?: string | null }) =>
        withFallback(() => addApplicationLink({ data: { applicationId, ...data } }), 'We could not add this link.'),
      onSuccess: () => invalidateApplicationQueries(queryClient, userId, applicationId),
    }),
    update: useMutation({
      mutationFn: (data: { id: string; url: string; label?: string | null }) =>
        withFallback(() => updateApplicationLink({ data }), 'We could not update this link.'),
      onSuccess: () => invalidateApplicationQueries(queryClient, userId, applicationId),
    }),
    remove: useMutation({
      mutationFn: (id: string) =>
        withFallback(() => deleteApplicationLink({ data: { id } }), 'We could not delete this link.'),
      onSuccess: () => invalidateApplicationQueries(queryClient, userId, applicationId),
    }),
  };
}
