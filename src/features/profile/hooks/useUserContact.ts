import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserContact, saveUserContact } from '@/features/profile/server';
import type { UserContactUpdate } from '@/features/profile/types';
import { error } from '@/shared/lib/result';

export const userContactKeys = {
  all: (userId: string) => ['user-contact', userId] as const,
};

export function userContactQueryOptions(userId: string) {
  return queryOptions({
    queryKey: userContactKeys.all(userId),
    queryFn: getUserContact,
  });
}

export function useUserContact(userId: string) {
  return useQuery(userContactQueryOptions(userId));
}

export function useSaveUserContact(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserContactUpdate) => {
      try {
        return await saveUserContact({ data });
      } catch {
        return error('We could not save your contact information.');
      }
    },
    onSuccess: (result) => {
      if (result.success) queryClient.setQueryData(userContactKeys.all(userId), result);
      void queryClient.invalidateQueries({ queryKey: userContactKeys.all(userId) });
    },
  });
}
