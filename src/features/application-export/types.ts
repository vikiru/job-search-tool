import type {
  SelectApplication,
  SelectApplicationAnalysis,
  SelectApplicationLink,
  SelectApplicationNote,
} from '@/server/db/zod';

export interface ApplicationExportRecord extends SelectApplication {
  analysis: SelectApplicationAnalysis | null;
  links: SelectApplicationLink[];
  notes: SelectApplicationNote[];
}

export interface ExportPayload {
  applications: ApplicationExportRecord[];
}
