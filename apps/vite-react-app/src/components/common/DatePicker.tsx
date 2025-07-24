import React from 'react';
import { Calendar } from '@workspace/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { Button } from '@workspace/ui/components/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@workspace/ui/lib/utils';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  disabled = false,
  className,
  minDate,
  maxDate,
  disabledDates,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  const getDisabledDates = (date: Date) => {
    if (disabledDates && disabledDates(date)) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, 'dd MMM yyyy', { locale: id })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        side="bottom"
        avoidCollisions={false}
        sideOffset={4}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={getDisabledDates}
          initialFocus
          fixedWeeks
          defaultMonth={value || new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;