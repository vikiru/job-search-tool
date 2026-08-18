import type { ApplicationExportRecord } from '@/features/applications/export/types';

export function serializeApplicationsToJson(applications: ApplicationExportRecord[]): string {
  return JSON.stringify(applications, null, 2);
}
