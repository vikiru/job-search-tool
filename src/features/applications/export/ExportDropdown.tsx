import { useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, Download } from 'lucide-react';

import { exportApplications } from '@/features/applications/export/export.server';
import { exportFormatSchema, type ExportFormat } from '@/features/applications/export/export.schema';
import { serializeApplicationsToCsv } from '@/features/applications/export/csv';
import { downloadApplicationExport } from '@/features/applications/export/download';
import { serializeApplicationsToJson } from '@/features/applications/export/json';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Spinner } from '@/shared/components/ui/spinner';

export function ExportDropdown() {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport(format: ExportFormat) {
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
      toast.success(`Applications exported as ${format.toUpperCase()}.`);
    } catch {
      toast.error('We could not export your applications.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button className="w-full font-heading sm:w-auto" disabled={isExporting} variant="outline" size="lg" />}
        aria-label="Export applications"
      >
        {isExporting ? <Spinner data-icon="inline-start" /> : <Download data-icon="inline-start" aria-hidden="true" />}
        {isExporting ? 'Exporting' : 'Export'}
        <ChevronDown data-icon="inline-end" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-52 p-2" align="end">
        <DropdownMenuItem
          className="gap-2.5 py-2.5 font-heading text-small font-medium leading-normal tracking-tight"
          disabled={isExporting}
          onClick={() => void handleExport('csv')}
        >
          <Download className="size-icon-sm" aria-hidden="true" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2.5 py-2.5 font-heading text-small font-medium leading-normal tracking-tight"
          disabled={isExporting}
          onClick={() => void handleExport('json')}
        >
          <Download className="size-icon-sm" aria-hidden="true" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
