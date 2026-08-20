import { useState } from 'react';
import { toast } from 'sonner';

import { serializeApplicationsToCsv } from '@/features/application-export/csv';
import { downloadApplicationExport } from '@/features/application-export/download';
import { exportFormatSchema, type ExportFormat } from '@/features/application-export/export.schema';
import { exportApplications } from '@/features/application-export/export.server';
import { serializeApplicationsToJson } from '@/features/application-export/json';

export function useApplicationExport() {
  const [isExporting, setIsExporting] = useState(false);

  async function exportApplicationsToFile(format: ExportFormat): Promise<void> {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const result = await exportApplications({ data: { format } });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      if (result.data.applications.length === 0) {
        toast.error('There are no applications to export.');
        return;
      }

      const content =
        format === exportFormatSchema.enum.csv
          ? serializeApplicationsToCsv(result.data.applications)
          : serializeApplicationsToJson(result.data.applications);
      downloadApplicationExport(content, format);
      toast.success(`Applications exported as ${format.toUpperCase()}.`, {
        description: `${result.data.applications.length} application${result.data.applications.length === 1 ? '' : 's'} downloaded.`,
      });
    } catch {
      toast.error('We could not export your applications.');
    } finally {
      setIsExporting(false);
    }
  }

  return { exportApplicationsToFile, isExporting };
}
