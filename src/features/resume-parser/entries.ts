import type { ParsedResumeSection, ResumeEntry, ResumeSectionKind, ResumeSkillGroup } from '@/entities/resume/types';

import { stripBullet } from '@/features/resume-parser/normalize';

const datePattern = /\b(?:\d{1,2}\/\d{4}|\d{4})\s*[–—-]\s*(?:\d{1,2}\/\d{4}|\d{4}|present|current)\b/i;
const certificationProviders = ['Coursera', 'Udemy', 'LinkedIn Learning', 'edX', 'Pluralsight', 'Codecademy'];

function createEntry(): ResumeEntry {
  return { bullets: [], lines: [], technologies: [] };
}

function parseDate(line: string): { dateRange?: string; text: string } {
  const match = line.match(datePattern);
  if (!match) return { text: line };
  return { dateRange: match[0].replaceAll('—', '–').replaceAll('-', '–'), text: line.replace(match[0], '').trim() };
}

function splitCertificationProvider(text: string): { provider?: string; title: string } {
  const normalizedText = text.toLowerCase();
  for (const provider of certificationProviders) {
    if (normalizedText.endsWith(provider.toLowerCase())) {
      return { provider, title: text.slice(0, -provider.length).trim() };
    }
  }
  return { title: text };
}

function parseHeader(line: string, entry: ResumeEntry, kind: ResumeSectionKind): void {
  const { dateRange, text } = parseDate(line);
  if (dateRange) entry.dateRange = dateRange;

  const [rawHeading, technologyText] = text
    .replaceAll(/\bView Certificate\b/gi, '')
    .split('|')
    .map((value) => value.trim());
  const { provider, title } =
    kind === 'certifications' ? splitCertificationProvider(rawHeading) : { title: rawHeading };
  entry.heading ??= title || undefined;
  entry.subheading ??= provider;
  if (technologyText) {
    addTechnologies(entry, technologyText);
  }
}

function addTechnologies(entry: ResumeEntry, technologyText: string): void {
  for (const technology of technologyText
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)) {
    if (!entry.technologies.includes(technology)) entry.technologies.push(technology);
  }
}

function attachMetadata(line: string, entry: ResumeEntry, kind: ResumeSectionKind): void {
  const { dateRange, text } = parseDate(line);
  if (dateRange) entry.dateRange = dateRange;

  const [rawHeading, technologyText] = text
    .replaceAll(/\bView Certificate\b/gi, '')
    .split('|')
    .map((value) => value.trim());
  const { provider, title } =
    kind === 'certifications' ? splitCertificationProvider(rawHeading) : { title: rawHeading };

  if (technologyText) addTechnologies(entry, technologyText);
  if (!title) return;
  if (!entry.heading) entry.heading = title;
  else if (!entry.subheading && title !== entry.heading) entry.subheading = title;
  entry.subheading ??= provider;
}

function isEntryHeaderCandidate(line: string, nextLine: string | undefined, kind: ResumeSectionKind): boolean {
  if (line.includes('|') || datePattern.test(line)) return true;
  const looksLikeHeading = /^(?:[A-Z][A-Za-z0-9&'’.-]*)(?:\s+[A-Z][A-Za-z0-9&'’.-]*){0,2}$/.test(line);
  return (
    (kind === 'projects' || kind === 'experience') &&
    looksLikeHeading &&
    Boolean(nextLine && (nextLine.startsWith('|') || datePattern.test(nextLine)))
  );
}

function parseSkills(lines: string[]): ResumeSkillGroup[] {
  return lines.flatMap((line) => {
    const separator = line.indexOf(':');
    if (separator < 1) return [];
    const label = line.slice(0, separator).trim();
    const values = line
      .slice(separator + 1)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    return values.length > 0 ? [{ label, values }] : [];
  });
}

function parseEntries(lines: string[], kind: ResumeSectionKind): ResumeEntry[] {
  const entries: ResumeEntry[] = [];
  let current: ResumeEntry | undefined;
  let pendingBullet = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const nextLine = lines[index + 1];
    const bullet = stripBullet(line);
    if (bullet.isBullet) {
      if (!current) {
        current = createEntry();
        entries.push(current);
      }
      if (bullet.text) current.bullets.push(bullet.text);
      else pendingBullet = true;
      continue;
    }

    if (pendingBullet) {
      if (!current) {
        current = createEntry();
        entries.push(current);
      }
      current.bullets.push(line);
      pendingBullet = false;
      continue;
    }

    if (/^view certificate$/i.test(line)) continue;

    const hasDate = datePattern.test(line);
    const isMetadataLine = line.startsWith('|') || hasDate;
    if (current?.bullets.length && !isEntryHeaderCandidate(line, nextLine, kind)) {
      current.bullets[current.bullets.length - 1] = `${current.bullets.at(-1)} ${line}`.trim();
      continue;
    }

    const startsNewEntry = Boolean(current?.dateRange) && !line.startsWith('|');
    if (!current || startsNewEntry) {
      current = createEntry();
      entries.push(current);
      parseHeader(line, current, kind);
      continue;
    }

    if (isMetadataLine) {
      attachMetadata(line, current, kind);
      continue;
    }

    if (!current.subheading && kind !== 'projects' && kind !== 'experience') {
      current.subheading = line;
    } else {
      current.lines.push(line);
    }
  }

  return entries.filter(
    (entry) => entry.heading || entry.subheading || entry.bullets.length > 0 || entry.lines.length > 0,
  );
}

export function parseSection(section: {
  heading: string;
  kind: ResumeSectionKind;
  lines: string[];
}): ParsedResumeSection {
  const skillGroups = section.kind === 'skills' ? parseSkills(section.lines) : [];
  return {
    entries: section.kind === 'skills' ? [] : parseEntries(section.lines, section.kind),
    heading: section.heading,
    kind: section.kind,
    lines: section.lines,
    skillGroups,
  };
}
