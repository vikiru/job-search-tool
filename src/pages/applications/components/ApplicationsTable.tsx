import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { formatApplicationDate, type ApplicationRecord } from '@/pages/applications/data';
import { ApplicationActionMenu } from '@/pages/applications/components/ApplicationActionMenu';
import { InterestRating } from '@/pages/applications/components/InterestRating';
import { StatusBadge } from '@/pages/applications/components/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';

type SortKey = 'company' | 'position' | 'status' | 'location' | 'interestRating' | 'applicationDate' | 'source';
type SortDirection = 'asc' | 'desc';

interface ApplicationsTableProps {
  applications: ApplicationRecord[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}

const columns: Array<{ key: SortKey; label: string }> = [
  { key: 'company', label: 'Company' },
  { key: 'position', label: 'Position' },
  { key: 'status', label: 'Status' },
  { key: 'location', label: 'Location' },
  { key: 'interestRating', label: 'Interest' },
  { key: 'applicationDate', label: 'Application date' },
  { key: 'source', label: 'Source' },
];

function ApplicationsTable({ applications, sortKey, sortDirection, onSort }: ApplicationsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead key={column.key} className="h-12 px-4">
              <button
                className="inline-flex items-center gap-1.5 font-heading text-caption font-semibold tracking-wide text-muted-foreground uppercase transition-colors motion-reduce:transition-none hover:text-foreground"
                type="button"
                onClick={() => onSort(column.key)}
                aria-label={`Sort by ${column.label}`}
              >
                {column.label}
                {sortKey === column.key ? (
                  sortDirection === 'asc' ? (
                    <ArrowUp className="size-icon-xs" aria-hidden="true" />
                  ) : (
                    <ArrowDown className="size-icon-xs" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDown className="size-icon-xs opacity-50" aria-hidden="true" />
                )}
              </button>
            </TableHead>
          ))}
          <TableHead className="w-12 px-4">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id} className="group">
            <TableCell className="px-4 py-4">
              <Link
                className="font-heading text-small font-semibold text-foreground transition-colors motion-reduce:transition-none hover:text-primary"
                to="/applications/$id"
                params={{ id: application.id }}
              >
                {application.company}
              </Link>
            </TableCell>
            <TableCell className="max-w-56 px-4 py-4">
              <Link
                className="block truncate text-small text-muted-foreground transition-colors motion-reduce:transition-none hover:text-primary"
                to="/applications/$id"
                params={{ id: application.id }}
              >
                {application.position}
              </Link>
            </TableCell>
            <TableCell className="px-4 py-4">
              <StatusBadge status={application.status} />
            </TableCell>
            <TableCell className="px-4 py-4 text-small text-muted-foreground">{application.location}</TableCell>
            <TableCell className="px-4 py-4">
              <InterestRating value={application.interestRating} />
            </TableCell>
            <TableCell className="px-4 py-4 font-mono text-caption tabular-nums text-muted-foreground">
              {formatApplicationDate(application.applicationDate)}
            </TableCell>
            <TableCell className="px-4 py-4 text-small text-muted-foreground">{application.source}</TableCell>
            <TableCell className="px-4 py-4">
              <ApplicationActionMenu application={application} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export type { SortDirection, SortKey };
export { ApplicationsTable };
