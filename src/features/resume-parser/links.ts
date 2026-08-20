import type { ParsedResumeLink } from '@/entities/resume/types';

const linkPattern =
  /(?:https?:\/\/|www\.)[^\s|]+|(?<![@\w])(?:[\w-]+\.)+(?:pages\.dev|netlify\.app|vercel\.app|github\.io|com|ca|dev|org|net|io|app)\b(?:\/[^\s|]*)?/gi;

function normalizeHref(value: string): string {
  const trimmed = value.replace(/[),.;]+$/, '');
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getLabel(href: string): string {
  const host = new URL(href).hostname.replace(/^www\./, '').toLowerCase();
  if (host.includes('linkedin')) return 'LinkedIn';
  if (host.includes('github')) return 'GitHub';
  if (host.endsWith('pages.dev') || host.endsWith('netlify.app') || host.endsWith('vercel.app')) return 'Portfolio';
  return host;
}

export function extractResumeLinks(lines: string[]): { lines: string[]; links: ParsedResumeLink[] } {
  const links: ParsedResumeLink[] = [];
  const seen = new Set<string>();
  const remainingLines = lines.map((line) => {
    const matches = line.match(linkPattern) ?? [];
    if (matches.length === 0) return line;

    for (const match of matches) {
      const href = normalizeHref(match);
      if (seen.has(href)) continue;

      seen.add(href);
      links.push({ href, label: getLabel(href) });
    }

    return line
      .replaceAll(linkPattern, '')
      .replaceAll(/\|+/g, ' ')
      .replaceAll(/\s{2,}/g, ' ')
      .trim();
  });

  return { lines: remainingLines.filter(Boolean), links };
}
