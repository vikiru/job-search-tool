import type { ApplicationExportRecord } from '@/features/applications/export/types';

const csvFields = [
  'company',
  'position',
  'status',
  'interestRating',
  'location',
  'workArrangement',
  'employmentType',
  'salaryMin',
  'salaryMax',
  'salaryCurrency',
  'salaryPeriod',
  'hoursPerWeek',
  'requisitionNumber',
  'applicationInstructions',
  'applicationUrl',
  'applicationDate',
  'source',
  'createdAt',
  'updatedAt',
] as const;

type CsvField = (typeof csvFields)[number];

function formatCsvValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function escapeCsvValue(value: unknown): string {
  const text = formatCsvValue(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function getCsvValue(application: ApplicationExportRecord, field: CsvField): unknown {
  if (field === 'applicationInstructions') return application.applicationInstructions?.join('; ') ?? null;
  return application[field];
}

export function serializeApplicationsToCsv(applications: ApplicationExportRecord[]): string {
  const rows = [csvFields.join(',')];

  for (const application of applications) {
    rows.push(csvFields.map((field) => escapeCsvValue(getCsvValue(application, field))).join(','));
  }

  return `${rows.join('\r\n')}\r\n`;
}
