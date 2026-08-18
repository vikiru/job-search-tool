const bulletPattern = /^[•●▪◦‣·]\s*/;
const sectionDatePattern = /(?<=[A-Za-z)])(?=\d{2}\/\d{4}\b)/g;
const locationPattern = /(?<=[a-z])(?=[A-Z][a-z]+,\s*[A-Z]{2}\b)/g;

function splitAttachedTokens(line: string): string {
  return line.replace(locationPattern, ' ').replace(sectionDatePattern, ' ');
}

function normalizeLine(line: string): string {
  return splitAttachedTokens(
    line
      .replaceAll('\u00a0', ' ')
      .replace(/[ \t]+/g, ' ')
      .trim(),
  );
}

export function normalizeResumeLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map(normalizeLine)
    .map((line) => line.replace(bulletPattern, '• '))
    .filter(Boolean);
}

export function stripBullet(line: string): { isBullet: boolean; text: string } {
  const match = line.match(/^[•●▪◦‣·*-]\s*(.*)$/);
  return match ? { isBullet: true, text: match[1].trim() } : { isBullet: false, text: line };
}
