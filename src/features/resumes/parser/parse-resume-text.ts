import type { ParsedResume, ResumeHeader } from '@/features/resumes/parser/types';

import { parseSection } from '@/features/resumes/parser/entries';
import { extractResumeLinks } from '@/features/resumes/parser/links';
import { normalizeResumeLines } from '@/features/resumes/parser/normalize';
import { groupResumeSections } from '@/features/resumes/parser/sections';

function parseHeader(lines: string[]): ResumeHeader {
  const [name, ...remaining] = lines;
  const title = remaining.find((line) => !line.includes(',') && line.length < 80);
  const location = remaining.find((line) => /,\s*[A-Z]{2}\b/.test(line));
  const summary = remaining
    .filter((line) => line !== title && line !== location)
    .join(' ')
    .trim();

  return {
    location,
    name,
    summary: summary || undefined,
    title,
  };
}

export function parseResumeText(rawText: string): ParsedResume {
  const normalizedLines = normalizeResumeLines(rawText);
  const linked = extractResumeLinks(normalizedLines);
  const grouped = groupResumeSections(linked.lines);

  return {
    header: parseHeader(grouped.headerLines),
    links: linked.links,
    rawText,
    sections: grouped.sections.map(parseSection),
  };
}
