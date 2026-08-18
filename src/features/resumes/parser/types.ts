export type ResumeSectionKind =
  | 'education'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'publications'
  | 'volunteer'
  | 'custom';

export interface ParsedResumeLink {
  href: string;
  label: string;
}

export interface ResumeHeader {
  location?: string;
  name?: string;
  summary?: string;
  title?: string;
}

export interface ResumeSkillGroup {
  label: string;
  values: string[];
}

export interface ResumeEntry {
  bullets: string[];
  dateRange?: string;
  heading?: string;
  lines: string[];
  subheading?: string;
  technologies: string[];
}

export interface ParsedResumeSection {
  entries: ResumeEntry[];
  heading: string;
  kind: ResumeSectionKind;
  lines: string[];
  skillGroups: ResumeSkillGroup[];
}

export interface ParsedResume {
  header: ResumeHeader;
  links: ParsedResumeLink[];
  rawText: string;
  sections: ParsedResumeSection[];
}
