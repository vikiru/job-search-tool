import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';

import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';

interface DatePickerProps {
  disabled?: boolean;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  value?: Date;
}

export function DatePicker({ disabled, onChange, placeholder = 'Select date', value }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-heading text-small font-normal',
              !value && 'text-muted-foreground',
            )}
          />
        }
      >
        <CalendarDays data-icon="inline-start" aria-hidden="true" />
        {value ? format(value, 'PPP') : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
