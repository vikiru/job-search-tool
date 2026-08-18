import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateApplicationInput, UpdateApplicationInput } from '@/features/applications/server';
import type { ApplicationDetail, ApplicationListItem } from '@/features/applications/types';
import type { ApplicationStatus } from '@/server/db/zod';

import { applicationKeys } from '@/features/applications/application-keys';
import { invalidateApplicationQueries, withFallback } from '@/features/applications/hooks/application-mutation-utils';
import {
  createApplication,
  deleteApplication,
  updateApplicationMutation,
  updateApplicationStatus,
} from '@/features/applications/server';
import {
  createApplicationFromJobDescription,
  type CreatedApplicationFromJobDescription,
} from '@/features/gemini/extract/server';
import { success, type Result } from '@/shared/lib/result';

type ApplicationMutationResult = Result<ApplicationDetail>;

interface StatusMutationInput {
  id: string;
  status: ApplicationStatus;
}

interface StatusMutationContext {
  detailSnapshot: Result<ApplicationDetail> | undefined;
  listSnapshot: Result<ApplicationListItem[]> | undefined;
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

export function useCreateApplicationFromJobDescription(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Result<CreatedApplicationFromJobDescription>,
    Error,
    { applicationUrl: string; jobDescriptionMd: string }
  >({
    mutationFn: (data) =>
      withFallback(() => createApplicationFromJobDescription({ data }), 'We could not save this application.'),
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

export function useUpdateApplicationStatusMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<ApplicationMutationResult, Error, StatusMutationInput, StatusMutationContext>({
    mutationFn: ({ id, status }) =>
      withFallback(
        () => updateApplicationStatus({ data: { id, status } }),
        'We could not change the application status.',
      ),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: applicationKeys.all(userId) });
      await queryClient.cancelQueries({ queryKey: applicationKeys.detail(userId, id) });

      const listSnapshot = queryClient.getQueryData<Result<ApplicationListItem[]>>(applicationKeys.all(userId));
      const detailSnapshot = queryClient.getQueryData<Result<ApplicationDetail>>(applicationKeys.detail(userId, id));

      queryClient.setQueryData<Result<ApplicationListItem[]>>(applicationKeys.all(userId), (current) => {
        if (!current?.success) return current;
        return success(
          current.data.map((application) => (application.id === id ? { ...application, status } : application)),
        );
      });

      queryClient.setQueryData<Result<ApplicationDetail>>(applicationKeys.detail(userId, id), (current) => {
        if (!current?.success) return current;
        return success({ ...current.data, status });
      });

      return { detailSnapshot, listSnapshot };
    },
    onError: (_error, { id }, context) => {
      if (!context) return;
      if (context.listSnapshot) queryClient.setQueryData(applicationKeys.all(userId), context.listSnapshot);
      if (context.detailSnapshot) queryClient.setQueryData(applicationKeys.detail(userId, id), context.detailSnapshot);
    },
    onSuccess: (result, { id }, context) => {
      if (!result.success) {
        if (!context) return;
        if (context.listSnapshot) queryClient.setQueryData(applicationKeys.all(userId), context.listSnapshot);
        if (context.detailSnapshot)
          queryClient.setQueryData(applicationKeys.detail(userId, id), context.detailSnapshot);
        return;
      }

      queryClient.setQueryData(applicationKeys.detail(userId, id), result);
      invalidateApplicationQueries(queryClient, userId, id);
    },
  });
}

export function useUpdateApplicationStatus(userId: string, id: string) {
  const mutation = useUpdateApplicationStatusMutation(userId);

  return {
    ...mutation,
    mutateAsync: (status: ApplicationStatus) => mutation.mutateAsync({ id, status }),
  };
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
