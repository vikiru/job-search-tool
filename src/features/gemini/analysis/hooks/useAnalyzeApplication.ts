import { useMutation, useQueryClient } from '@tanstack/react-query';

import { analyzeApplication } from '@/features/gemini/analysis/server';
import { applicationKeys } from '@/features/applications/hooks/useApplications';
import type { MatchAnalysisData } from '@/features/gemini/analysis/analysis.schema';
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
