/* oxlint-disable react/no-unstable-nested-components -- react-day-picker requires this inline component override. */

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';

import { cn } from '@/shared/lib/utils';

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col gap-4 sm:flex-row',
        month: 'space-y-4',
        month_caption: 'relative flex h-7 items-center justify-center px-8',
        caption_label: 'font-heading text-small font-semibold',
        nav: 'absolute inset-x-1 top-0 flex items-center justify-between',
        button_previous:
          'inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
        button_next:
          'inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'w-8 rounded-md text-center font-heading text-caption font-medium text-muted-foreground',
        week: 'mt-2 flex w-full',
        day: 'relative size-8 p-0 text-center text-small',
        day_button:
          'inline-flex size-8 items-center justify-center rounded-md font-normal transition-colors motion-reduce:transition-none hover:bg-muted focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 aria-selected:bg-primary aria-selected:text-primary-foreground',
        today: 'font-semibold text-primary',
        outside: 'text-muted-foreground/50',
        disabled: 'pointer-events-none text-muted-foreground/40',
        hidden: 'invisible',
        selected: 'bg-primary text-primary-foreground',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName }) => {
          if (orientation === 'left') return <ChevronLeft className={cn('size-4', iconClassName)} aria-hidden="true" />;
          if (orientation === 'right')
            return <ChevronRight className={cn('size-4', iconClassName)} aria-hidden="true" />;
          return <ChevronDown className={cn('size-4', iconClassName)} aria-hidden="true" />;
        },
      }}
      {...props}
    />
  );
}
