import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MatchAnalysisData } from '@/server/ai/fit-analysis-schema';

import { applicationKeys } from '@/features/application-data/application-keys';
import { analyzeApplication } from '@/features/fit-analysis/server';
import { error, type Result } from '@/shared/lib/result';

export function useAnalyzeApplication(userId: string, applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation<Result<MatchAnalysisData>, Error, string>({
    mutationFn: async (resumeText) => {
      try {
        return await analyzeApplication({ data: { applicationId, resumeText } });
      } catch {
        return error('We could not analyze this application right now.');
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        void queryClient.invalidateQueries({ queryKey: applicationKeys.detail(userId, applicationId) });
      }
    },
  });
}
