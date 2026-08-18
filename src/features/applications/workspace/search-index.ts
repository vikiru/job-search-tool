import FlexSearch from 'flexsearch';

import type { ApplicationRecord } from '@/pages/applications/application-model';

export interface ApplicationSearchDocument {
  company: string;
  id: string;
  position: string;
}

export const searchIndexOptions = {
  document: {
    id: 'id',
    index: [
      { field: 'company', tokenize: 'forward' as const },
      { field: 'position', tokenize: 'forward' as const },
    ],
  },
};

export function toApplicationSearchDocument(application: ApplicationRecord): ApplicationSearchDocument {
  return {
    company: application.company,
    id: application.id,
    position: application.position,
  };
}

export function createApplicationsSearchIndex(applications: ApplicationRecord[]) {
  const index = new FlexSearch.Document<ApplicationSearchDocument>(searchIndexOptions);

  for (const application of applications) {
    index.add(toApplicationSearchDocument(application));
  }

  return index;
}

export function searchApplicationIds(
  index: FlexSearch.Document<ApplicationSearchDocument>,
  query: string,
): Set<string> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return new Set();

  const results = index.search(normalizedQuery, { bool: 'and' });
  return new Set(results.flatMap((result) => result.result.map(String)));
}
