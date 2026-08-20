/* oxlint-disable react/no-unstable-nested-components -- TanStack Table cell renderers are render callbacks, not component definitions. */

import { Link } from '@tanstack/react-router';
import {
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  flexRender,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo } from 'react';

import {
  formatApplicationDate,
  statusSortOrder,
  type ApplicationRecord,
  type ApplicationStatus,
  type InterestRating,
} from '@/entities/application/model';
import { type ApplicationSortDirection, type ApplicationSortKey } from '@/entities/application/search-params';
import { ApplicationActionMenu } from '@/pages/applications/components/ApplicationActionMenu';
import { InterestRating as InterestRatingDisplay } from '@/pages/applications/components/InterestRating';
import { StatusBadge } from '@/pages/applications/components/StatusBadge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { cn } from '@/shared/lib/utils';

const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, ApplicationRecord>();

const columnWidthClasses: Record<string, string> = {
  actions: 'w-14',
  applicationDate: 'w-40',
  company: 'w-44',
  interestRating: 'w-32',
  location: 'w-44',
  position: 'w-72',
  source: 'w-40',
  status: 'w-40',
};

interface ApplicationsTableProps {
  applications: ApplicationRecord[];
  columnFilters: ColumnFiltersState;
  onSortingChange: OnChangeFn<SortingState>;
  pagination: PaginationState;
  sorting: SortingState;
  userId: string;
}

function ApplicationsTable({
  applications,
  columnFilters,
  onSortingChange,
  pagination,
  sorting,
  userId,
}: ApplicationsTableProps) {
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('company', {
          header: 'Company',
          sortFn: 'auto',
          cell: ({ row }) => (
            <Link
              className="font-heading text-small font-semibold text-foreground transition-colors hover:text-primary motion-reduce:transition-none"
              to="/applications/$id"
              params={{ id: row.original.id }}
            >
              {row.original.company}
            </Link>
          ),
        }),
        columnHelper.accessor('position', {
          header: 'Position',
          sortFn: 'auto',
          cell: ({ row }) => (
            <Link
              className="block truncate text-small text-muted-foreground transition-colors hover:text-primary motion-reduce:transition-none"
              to="/applications/$id"
              params={{ id: row.original.id }}
            >
              {row.original.position}
            </Link>
          ),
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          sortFn: (rowA, rowB, columnId) =>
            statusSortOrder[rowA.getValue<ApplicationStatus>(columnId)] -
            statusSortOrder[rowB.getValue<ApplicationStatus>(columnId)],
          filterFn: (row, columnId, value) => row.getValue(columnId) === value,
          cell: ({ row }) => <StatusBadge status={row.original.status} />,
        }),
        columnHelper.accessor('location', {
          header: 'Location',
          sortFn: 'auto',
          cell: ({ row }) => <span className="text-small text-muted-foreground">{row.original.location}</span>,
        }),
        columnHelper.accessor('interestRating', {
          header: 'Interest',
          sortFn: 'auto',
          filterFn: (row, columnId, value) => (row.getValue<InterestRating | null>(columnId) ?? 0) >= Number(value),
          cell: ({ row }) => <InterestRatingDisplay value={row.original.interestRating} />,
        }),
        columnHelper.accessor('applicationDate', {
          header: 'Application date',
          sortFn: 'auto',
          cell: ({ row }) => (
            <span className="font-mono text-caption text-muted-foreground tabular-nums">
              {formatApplicationDate(row.original.applicationDate)}
            </span>
          ),
        }),
        columnHelper.accessor('source', {
          header: 'Source',
          sortFn: 'auto',
          cell: ({ row }) => <span className="text-small text-muted-foreground">{row.original.source}</span>,
        }),
        columnHelper.display({
          id: 'actions',
          header: '',
          cell: ({ row }) => <ApplicationActionMenu application={row.original} userId={userId} />,
        }),
      ]),
    [userId],
  );

  const table = useTable({
    features,
    columns,
    data: applications,
    state: { columnFilters, pagination, sorting },
    onSortingChange,
    getRowId: (application) => application.id,
  });

  return (
    <Table className="min-w-[68rem] text-small">
      <TableCaption className="sr-only">Applications in your workspace</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => {
              const sorted = header.column.getIsSorted();

              return (
                <TableHead
                  key={header.id}
                  className={cn('h-12 px-4', columnWidthClasses[header.column.id])}
                  aria-sort={
                    header.column.id === 'actions' || !sorted ? 'none' : sorted === 'asc' ? 'ascending' : 'descending'
                  }
                >
                  {header.column.id === 'actions' ? (
                    <span className="sr-only">Actions</span>
                  ) : (
                    <button
                      className="inline-flex items-center gap-1.5 rounded-sm font-heading text-caption font-semibold tracking-wide text-muted-foreground uppercase transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label={`Sort by ${String(header.column.columnDef.header)}${sorted ? `, currently ${sorted}` : ''}`}
                      aria-describedby={`${header.id}-sort-help`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sorted === 'asc' ? (
                        <ArrowUp className="size-icon-xs" aria-hidden="true" />
                      ) : sorted === 'desc' ? (
                        <ArrowDown className="size-icon-xs" aria-hidden="true" />
                      ) : (
                        <ArrowUpDown className="size-icon-xs opacity-50" aria-hidden="true" />
                      )}
                    </button>
                  )}
                  {header.column.id !== 'actions' && (
                    <span id={`${header.id}-sort-help`} className="sr-only">
                      Activates sorting for this column
                    </span>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="group">
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id} className="p-4">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export type { ApplicationSortDirection as SortDirection, ApplicationSortKey as SortKey };
export { ApplicationsTable };
