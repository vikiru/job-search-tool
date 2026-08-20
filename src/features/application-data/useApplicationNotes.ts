import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateApplicationQueries, withFallback } from '@/features/application-data/application-mutation-utils';
import { addApplicationNote, deleteApplicationNote, updateApplicationNote } from '@/features/application-data/server';

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
