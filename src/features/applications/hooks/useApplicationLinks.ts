import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateApplicationQueries, withFallback } from '@/features/applications/hooks/application-mutation-utils';
import { addApplicationLink, deleteApplicationLink, updateApplicationLink } from '@/features/applications/server';

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
