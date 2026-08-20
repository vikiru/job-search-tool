export const applicationKeys = {
  all: (userId: string) => ['user', userId, 'applications'] as const,
  detail: (userId: string, id: string) => ['user', userId, 'applications', id] as const,
};
