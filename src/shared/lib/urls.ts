const HTTP_PROTOCOLS = new Set(['http:', 'https:']);

export function isSafeHttpUrl(value: string): boolean {
  try {
    return HTTP_PROTOCOLS.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function toSafeHttpUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return isSafeHttpUrl(candidate) ? candidate : null;
}
