function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nullableString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function stringList(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    const items = value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length > 0 ? items : null;
  }

  const item = nullableString(value);
  return item ? [item] : null;
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = value.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeKeywords(value: unknown, technologies: string[] | null, skills: string[] | null): string[] | null {
  const comparisonTerms = uniqueStrings([...(technologies ?? []), ...(skills ?? [])]);
  if (comparisonTerms.length === 0) return null;

  const termsByKey = new Map(comparisonTerms.map((term) => [term.toLocaleLowerCase(), term]));
  const requestedKeywords = stringList(value) ?? [];
  const matchingKeywords = requestedKeywords
    .map((keyword) => termsByKey.get(keyword.toLocaleLowerCase()))
    .filter((keyword): keyword is string => keyword !== undefined);

  return uniqueStrings(matchingKeywords.length > 0 ? matchingKeywords : comparisonTerms);
}

function numberValue(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function isLikelyJobDescriptionHeading(line: string, nextLine: string | undefined): boolean {
  if (!line || !nextLine || line.startsWith('- ') || line.startsWith('* ') || line.startsWith('> ')) return false;
  if (line.startsWith('**') || line.includes('://') || line.includes('@')) return false;
  if (
    /^(address|application deadline|city|country|employment type|job type|pay type|platform|posted date|source):/i.test(
      line,
    )
  ) {
    return false;
  }

  const words = line.split(/\s+/);
  if (words.length > 10) return false;
  if (/[.,;:]$/.test(line)) return false;
  if (line.endsWith('?')) return words.length <= 12;

  const startsWithUppercase = /^[A-Z]/.test(line);
  const titleLike = words.filter((word) => /^[A-Z][A-Za-z'’/-]*$/.test(word)).length >= Math.max(1, words.length - 1);
  return startsWithUppercase && (titleLike || words.length <= 4);
}

function normalizeJobDescriptionMarkdown(value: string | null): string | null {
  if (!value) return null;

  const lines = value.split(/\r?\n/).map((line) => line.trim());
  const normalizedLines = lines.map((line, index) => {
    const normalizedLine = line.replace(/^#{1,6}\s+/, '');
    if (isLikelyJobDescriptionHeading(normalizedLine, lines[index + 1])) return `## ${normalizedLine}`;
    if (/^address:\s*/i.test(line)) return line.replace(/^address:\s*/i, '**Address:** ');
    if (/^application deadline:\s*/i.test(line)) {
      return line.replace(/^application deadline:\s*/i, '**Application deadline:** ');
    }
    return line;
  });

  return (
    normalizedLines
      .join('\n')
      .replaceAll(/\n{3,}/g, '\n\n')
      .trim() || null
  );
}

function normalizeWorkArrangement(value: unknown): 'REMOTE' | 'HYBRID' | 'ONSITE' | null {
  const normalized = nullableString(value)?.toUpperCase().replaceAll('-', '').replaceAll(' ', '');
  if (normalized?.includes('REMOTE')) return 'REMOTE';
  if (normalized?.includes('HYBRID')) return 'HYBRID';
  if (normalized?.includes('ONSITE') || normalized?.includes('OFFICE')) return 'ONSITE';
  return null;
}

function normalizeEmploymentType(value: unknown): 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | null {
  const normalized = nullableString(Array.isArray(value) ? value[0] : value)
    ?.toLowerCase()
    .replaceAll('-', '')
    .replaceAll(' ', '');
  if (normalized === 'fulltime') return 'Full-time';
  if (normalized === 'parttime') return 'Part-time';
  if (normalized === 'contract') return 'Contract';
  if (normalized === 'internship' || normalized === 'intern') return 'Internship';
  return null;
}

function normalizeSalaryPeriod(value: unknown): 'YEARLY' | 'HOURLY' | 'MONTHLY' | 'WEEKLY' | null {
  const normalized = nullableString(value)?.toLowerCase();
  if (normalized?.includes('year') || normalized?.includes('annual')) return 'YEARLY';
  if (normalized?.includes('hour')) return 'HOURLY';
  if (normalized?.includes('month')) return 'MONTHLY';
  if (normalized?.includes('week')) return 'WEEKLY';
  return null;
}

export function normalizeExtractionPayload(input: unknown): unknown {
  if (!isRecord(input)) return input;

  const salary = isRecord(input.salary) ? input.salary : {};
  const location = isRecord(input.location) ? input.location : {};
  const remote = location.remote === true;
  const locationParts = [location.city, location.state, location.country]
    .map(nullableString)
    .filter((value): value is string => value !== null);

  const technologies = stringList(input.technologies);
  const skills = stringList(input.skills);

  return {
    jobDescriptionMd: normalizeJobDescriptionMarkdown(nullableString(input.jobDescriptionMd)),
    company: nullableString(input.company),
    position: nullableString(input.position ?? input.jobTitle),
    location: nullableString(input.location) ?? (locationParts.length > 0 ? locationParts.join(', ') : null),
    workArrangement: normalizeWorkArrangement(input.workArrangement) ?? (remote ? 'REMOTE' : null),
    employmentType: normalizeEmploymentType(input.employmentType),
    salaryMin: numberValue(input.salaryMin ?? salary.min),
    salaryMax: numberValue(input.salaryMax ?? salary.max),
    salaryCurrency: nullableString(input.salaryCurrency ?? salary.currency),
    salaryPeriod: normalizeSalaryPeriod(input.salaryPeriod),
    hoursPerWeek: numberValue(input.hoursPerWeek),
    requisitionNumber: nullableString(input.requisitionNumber),
    applicationInstructions: stringList(input.applicationInstructions),
    source: nullableString(input.source),
    technologies,
    skills,
    qualifications: stringList(input.qualifications),
    responsibilities: stringList(input.responsibilities),
    benefits: stringList(input.benefits),
    keywords: normalizeKeywords(input.keywords, technologies, skills),
  };
}
