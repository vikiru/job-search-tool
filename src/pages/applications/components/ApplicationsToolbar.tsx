import { ChevronDown, Download, ListFilter, Star } from 'lucide-react';

import { ApplicationsSearchBar } from '@/pages/applications/components/ApplicationsSearchBar';
import { PasteJdDialog } from '@/pages/applications/components/PasteJdDialog';
import type { ApplicationStatus, ApplicationView, InterestRating } from '@/pages/applications/data';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface ApplicationsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ApplicationStatus | 'ALL';
  onStatusFilterChange: (value: ApplicationStatus | 'ALL') => void;
  interestFilter: InterestRating | 'ALL';
  onInterestFilterChange: (value: InterestRating | 'ALL') => void;
  view: ApplicationView;
  onViewChange: (value: ApplicationView) => void;
}

function ApplicationsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  interestFilter,
  onInterestFilterChange,
  view,
  onViewChange,
}: ApplicationsToolbarProps) {
  return (
    <div className="space-y-4 border-b border-border/70 p-3 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <ApplicationsSearchBar value={search} onChange={onSearchChange} />
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as ApplicationStatus | 'ALL')}
          >
            <SelectTrigger className="h-10 w-full min-w-0" aria-label="Filter by status">
              <ListFilter className="size-icon-sm text-muted-foreground" aria-hidden="true" />
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="min-w-48 p-2">
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="SAVED">Saved</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="SCREENING">Screening</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
              <SelectItem value="OFFER">Offer</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              <SelectItem value="GHOSTED">Ghosted</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={String(interestFilter)}
            onValueChange={(value) => {
              const nextValue = String(value);
              onInterestFilterChange(nextValue === 'ALL' ? 'ALL' : (Number(nextValue) as InterestRating));
            }}
          >
            <SelectTrigger className="h-10 w-full min-w-0" aria-label="Filter by interest rating">
              <Star className="size-icon-sm text-muted-foreground" aria-hidden="true" />
              <SelectValue placeholder="Interest" />
            </SelectTrigger>
            <SelectContent className="min-w-44 p-2">
              <SelectItem value="ALL">Any interest</SelectItem>
              <SelectItem value="5">5 of 5</SelectItem>
              <SelectItem value="4">4+ of 5</SelectItem>
              <SelectItem value="3">3+ of 5</SelectItem>
              <SelectItem value="2">2+ of 5</SelectItem>
              <SelectItem value="1">1+ of 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={view} onValueChange={(value) => onViewChange(value as ApplicationView)}>
          <TabsList className="w-full sm:w-auto" aria-label="Applications view">
            <TabsTrigger className="min-w-24 font-heading" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="min-w-24 font-heading" value="kanban">
              Kanban
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button className="w-full font-heading sm:w-auto" variant="outline" size="lg" />}
              aria-label="Export applications"
            >
              <Download data-icon="inline-start" aria-hidden="true" />
              Export
              <ChevronDown data-icon="inline-end" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-52 p-2" align="end">
              <DropdownMenuItem className="gap-2.5 py-2.5 text-small">
                <Download className="size-icon-sm" aria-hidden="true" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5 py-2.5 text-small">
                <Download className="size-icon-sm" aria-hidden="true" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <PasteJdDialog />
        </div>
      </div>
    </div>
  );
}

export { ApplicationsToolbar };
