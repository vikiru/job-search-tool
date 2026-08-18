/* oxlint-disable jsx_a11y/prefer-tag-over-role -- the button is the combobox trigger required by the ARIA pattern. */

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { useId, useState } from 'react';

interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  disabled?: boolean;
  emptyText?: string;
  onValueChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string;
}

export function Combobox({
  disabled,
  emptyText = 'No matches found.',
  onValueChange,
  options,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search options...',
  value = '',
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            disabled={disabled}
            className="w-full justify-between font-heading text-small font-normal"
          />
        }
      >
        <span className={cn('truncate', !selectedOption && 'text-muted-foreground')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronsUpDown className="size-icon-sm shrink-0 opacity-50" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList id={listId}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={`${option.value} ${option.label}`}
                onSelect={() => {
                  onValueChange(option.value === value ? '' : option.value);
                  setOpen(false);
                }}
              >
                {option.label}
                <Check
                  className={cn('ml-auto size-icon-sm', value === option.value ? 'opacity-100' : 'opacity-0')}
                  aria-hidden="true"
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export type { ComboboxOption };
