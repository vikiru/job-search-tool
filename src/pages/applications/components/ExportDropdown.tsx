import { ChevronDown, Download } from 'lucide-react';

import { useApplicationExport } from '@/features/application-export/useApplicationExport';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Spinner } from '@/shared/components/ui/spinner';

export function ExportDropdown() {
  const { exportApplicationsToFile, isExporting } = useApplicationExport();

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
          className="gap-2.5 py-2.5 font-heading text-small leading-normal font-medium tracking-tight"
          disabled={isExporting}
          onClick={() => void exportApplicationsToFile('csv')}
        >
          <Download className="size-icon-sm" aria-hidden="true" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2.5 py-2.5 font-heading text-small leading-normal font-medium tracking-tight"
          disabled={isExporting}
          onClick={() => void exportApplicationsToFile('json')}
        >
          <Download className="size-icon-sm" aria-hidden="true" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
