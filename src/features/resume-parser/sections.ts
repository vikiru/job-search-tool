import type { ResumeSectionKind } from '@/entities/resume/types';

interface SectionAlias {
  heading: string;
  kind: ResumeSectionKind;
  aliases: string[];
}

const sectionAliases: SectionAlias[] = [
  { heading: 'Education', kind: 'education', aliases: ['education', 'academic background'] },
  {
    heading: 'Experience',
    kind: 'experience',
    aliases: ['experience', 'work experience', 'professional experience', 'employment history'],
  },
  {
    heading: 'Skills',
    kind: 'skills',
    aliases: ['skills', 'technical skills', 'core competencies', 'technical proficiencies'],
  },
  { heading: 'Projects', kind: 'projects', aliases: ['projects', 'selected projects', 'personal projects'] },
  {
    heading: 'Certifications',
    kind: 'certifications',
    aliases: ['certifications', 'certificates', 'licenses', 'licenses and certifications'],
  },
  { heading: 'Awards', kind: 'awards', aliases: ['awards', 'honors', 'achievements'] },
  { heading: 'Publications', kind: 'publications', aliases: ['publications', 'papers'] },
  { heading: 'Volunteer Experience', kind: 'volunteer', aliases: ['volunteer experience', 'volunteering'] },
  { heading: 'Summary', kind: 'custom', aliases: ['summary', 'profile', 'professional summary', 'objective'] },
  {
    heading: 'Additional Information',
    kind: 'custom',
    aliases: [
      'additional information',
      'interests',
      'community work',
      'leadership',
      'research',
      'teaching',
      'professional development',
      'references',
    ],
  },
];

function cleanHeading(value: string): string {
  return value.replace(/[\s:|-]+$/, '').trim();
}

export function matchSectionHeading(
  line: string,
): { heading: string; kind: ResumeSectionKind; remainder: string } | null {
  const normalized = line.trim();
  const lowercase = normalized.toLowerCase();

  for (const section of sectionAliases) {
    for (const alias of section.aliases) {
      if (lowercase === alias) {
        return { heading: section.heading, kind: section.kind, remainder: '' };
      }

      if (lowercase.startsWith(`${alias}:`)) {
        return {
          heading: section.heading,
          kind: section.kind,
          remainder: normalized.slice(alias.length + 1).trim(),
        };
      }

      if (lowercase.startsWith(alias) && /^[A-Z]/.test(normalized.slice(alias.length))) {
        return { heading: section.heading, kind: section.kind, remainder: normalized.slice(alias.length).trim() };
      }
    }
  }

  return null;
}

export function groupResumeSections(lines: string[]): {
  headerLines: string[];
  sections: Array<{ heading: string; kind: ResumeSectionKind; lines: string[] }>;
} {
  const headerLines: string[] = [];
  const sections: Array<{ heading: string; kind: ResumeSectionKind; lines: string[] }> = [];
  let current: { heading: string; kind: ResumeSectionKind; lines: string[] } | undefined;

  for (const line of lines) {
    const match = matchSectionHeading(line);
    if (match) {
      current = { heading: cleanHeading(match.heading), kind: match.kind, lines: [] };
      sections.push(current);
      if (match.remainder) current.lines.push(match.remainder);
      continue;
    }

    if (current) current.lines.push(line);
    else headerLines.push(line);
  }

  return { headerLines, sections };
}
