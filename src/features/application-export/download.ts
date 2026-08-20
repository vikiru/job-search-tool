import type { ExportFormat } from '@/features/application-export/export.schema';

const exportMimeTypes: Record<ExportFormat, string> = {
  csv: 'text/csv;charset=utf-8',
  json: 'application/json;charset=utf-8',
};

export function downloadApplicationExport(content: string, format: ExportFormat): void {
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([content], { type: exportMimeTypes[format] });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `applications-export-${date}.${format}`;
  anchor.click();
  URL.revokeObjectURL(url);
}
