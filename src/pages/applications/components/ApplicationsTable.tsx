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
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { type ApplicationSortDirection, type ApplicationSortKey } from '@/pages/applications/application-search-params';
import {
  formatApplicationDate,
  statusSortOrder,
  type ApplicationRecord,
  type ApplicationStatus,
  type InterestRating,
} from '@/pages/applications/data';
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

const columns = columnHelper.columns([
  columnHelper.accessor('company', { header: 'Company', sortFn: 'auto' }),
  columnHelper.accessor('position', { header: 'Position', sortFn: 'auto' }),
  columnHelper.accessor('status', {
    header: 'Status',
    sortFn: (rowA, rowB, columnId) =>
      statusSortOrder[rowA.getValue<ApplicationStatus>(columnId)] -
      statusSortOrder[rowB.getValue<ApplicationStatus>(columnId)],
    filterFn: (row, columnId, value) => row.getValue(columnId) === value,
  }),
  columnHelper.accessor('location', { header: 'Location', sortFn: 'auto' }),
  columnHelper.accessor('interestRating', {
    header: 'Interest',
    sortFn: 'auto',
    filterFn: (row, columnId, value) => (row.getValue<InterestRating | null>(columnId) ?? 0) >= Number(value),
  }),
  columnHelper.accessor('applicationDate', { header: 'Application date', sortFn: 'auto' }),
  columnHelper.accessor('source', { header: 'Source', sortFn: 'auto' }),
  columnHelper.display({ id: 'actions', header: '' }),
]);

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
  const table = useTable({
    features,
    columns,
    data: applications,
    state: { columnFilters, pagination, sorting },
    onSortingChange,
    getRowId: (application) => application.id,
    pageCount: Math.ceil(applications.length / pagination.pageSize),
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
                      className="inline-flex items-center gap-1.5 rounded-sm font-heading text-caption font-semibold tracking-wide text-muted-foreground uppercase transition-colors outline-none motion-reduce:transition-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label={`Sort by ${String(header.column.columnDef.header)}${sorted ? `, currently ${sorted}` : ''}`}
                      aria-describedby={`${header.id}-sort-help`}
                    >
                      {header.column.columnDef.header as string}
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
            <TableCell className="px-4 py-4">
              <Link
                className="font-heading text-small font-semibold text-foreground transition-colors motion-reduce:transition-none hover:text-primary"
                to="/applications/$id"
                params={{ id: row.original.id }}
              >
                {row.original.company}
              </Link>
            </TableCell>
            <TableCell className="max-w-56 px-4 py-4">
              <Link
                className="block truncate text-small text-muted-foreground transition-colors motion-reduce:transition-none hover:text-primary"
                to="/applications/$id"
                params={{ id: row.original.id }}
              >
                {row.original.position}
              </Link>
            </TableCell>
            <TableCell className="px-4 py-4">
              <StatusBadge status={row.original.status} />
            </TableCell>
            <TableCell className="px-4 py-4 text-small text-muted-foreground">{row.original.location}</TableCell>
            <TableCell className="px-4 py-4">
              <InterestRatingDisplay value={row.original.interestRating} />
            </TableCell>
            <TableCell className="px-4 py-4 font-mono text-caption tabular-nums text-muted-foreground">
              {formatApplicationDate(row.original.applicationDate)}
            </TableCell>
            <TableCell className="px-4 py-4 text-small text-muted-foreground">{row.original.source}</TableCell>
            <TableCell className="px-4 py-4">
              <ApplicationActionMenu application={row.original} userId={userId} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export type { ApplicationSortDirection as SortDirection, ApplicationSortKey as SortKey };
export { ApplicationsTable };
