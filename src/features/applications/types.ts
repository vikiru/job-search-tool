import type {
  SelectApplication,
  SelectApplicationActivity,
  SelectApplicationAnalysis,
  SelectApplicationLink,
  SelectApplicationNote,
} from '@/server/db/zod';

export interface ApplicationListItem extends SelectApplication {
  analysis: SelectApplicationAnalysis | null;
}

export interface ApplicationDetail extends SelectApplication {
  activity: SelectApplicationActivity[];
  analysis: SelectApplicationAnalysis | null;
  links: SelectApplicationLink[];
  notes: SelectApplicationNote[];
}

export interface RecentApplicationActivity {
  activity: SelectApplicationActivity;
  company: string;
  position: string;
}
