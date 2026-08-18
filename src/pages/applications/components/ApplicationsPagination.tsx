import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface ApplicationsPaginationProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function ApplicationsPagination({
  pageIndex,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: ApplicationsPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const firstItem = total === 0 ? 0 : pageIndex * pageSize + 1;
  const lastItem = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex flex-col gap-4 border-t border-border/70 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="font-mono text-small text-muted-foreground tabular-nums" aria-live="polite">
        Showing{' '}
        <span className="font-semibold text-foreground">
          {firstItem}–{lastItem}
        </span>{' '}
        of <span className="font-semibold text-foreground">{total}</span>
      </p>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="h-9 w-28 font-heading text-small" aria-label="Applications per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-32 p-2">
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="25">25 per page</SelectItem>
          </SelectContent>
        </Select>
        {pageCount > 1 && (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={pageIndex === 0}
                  className={pageIndex === 0 ? 'pointer-events-none opacity-50' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    if (pageIndex > 0) onPageChange(pageIndex - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-2 font-mono text-caption text-muted-foreground tabular-nums">
                  {pageIndex + 1} / {pageCount}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={pageIndex === pageCount - 1}
                  className={pageIndex === pageCount - 1 ? 'pointer-events-none opacity-50' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    if (pageIndex < pageCount - 1) onPageChange(pageIndex + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export { ApplicationsPagination };
