export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...applicationKeys.lists(), filters] as const,
  details: () => [...applicationKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
  analysis: (id: string) => [...applicationKeys.detail(id), 'analysis'] as const,
  notes: (id: string) => [...applicationKeys.detail(id), 'notes'] as const,
  links: (id: string) => [...applicationKeys.detail(id), 'links'] as const,
};

export const resumeKeys = {
  all: ['resumes'] as const,
  default: () => [...resumeKeys.all, 'default'] as const,
};

export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: () => [...dashboardKeys.all, 'metrics'] as const,
};
