/* oxlint-disable import/no-unassigned-import -- this import intentionally prevents client bundling. */

import '@tanstack/react-start/server-only';

export function logServerError(scope: string, cause: unknown): void {
  const details =
    cause instanceof Error
      ? { name: cause.name, message: cause.message, stack: cause.stack }
      : { message: 'Unknown server error', value: String(cause) };

  console.error(`[${scope}]`, details);
}
