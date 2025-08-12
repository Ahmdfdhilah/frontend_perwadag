import React from 'react';
import { Calendar } from '@workspace/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@workspace/ui/lib/utils';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Pilih tanggal dan waktu",
  disabled = false,
  className,
  minDate,
  maxDate,
  disabledDates,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [hours, setHours] = React.useState<string>(value ? String(value.getHours()).padStart(2, '0') : '09');
  const [minutes, setMinutes] = React.useState<string>(value ? String(value.getMinutes()).padStart(2, '0') : '00');

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setHours(String(value.getHours()).padStart(2, '0'));
      setMinutes(String(value.getMinutes()).padStart(2, '0'));
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Combine date with current time
      const newDateTime = new Date(date);
      newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      onChange(newDateTime);
    } else {
      onChange(undefined);
    }
  };

  const handleTimeChange = (newHours?: string, newMinutes?: string) => {
    const h = newHours ?? hours;
    const m = newMinutes ?? minutes;
    
    setHours(h);
    setMinutes(m);
    
    if (selectedDate) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(parseInt(h), parseInt(m), 0, 0);
      onChange(newDateTime);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = e.target.value;
    if (/^\d{0,2}$/.test(newHours) && (newHours === '' || (parseInt(newHours) >= 0 && parseInt(newHours) <= 23))) {
      handleTimeChange(newHours.padStart(2, '0'));
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = e.target.value;
    if (/^\d{0,2}$/.test(newMinutes) && (newMinutes === '' || (parseInt(newMinutes) >= 0 && parseInt(newMinutes) <= 59))) {
      handleTimeChange(undefined, newMinutes.padStart(2, '0'));
    }
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
            format(value, 'dd MMM yyyy, HH:mm', { locale: id })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto max-w-[90vw] p-0" 
        align="start"
        side="bottom"
        avoidCollisions={true}
        sideOffset={4}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="p-2 sm:p-3 flex justify-center sm:justify-start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={getDisabledDates}
              initialFocus
              fixedWeeks={false}
              defaultMonth={selectedDate || new Date()}
              className="w-fit sm:w-full"
              classNames={{
                months: "flex flex-col space-y-4",
                month: "space-y-4 w-fit",
                table: "w-fit border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 sm:w-9 font-normal text-[0.8rem] flex items-center justify-center",
                row: "flex w-fit mt-2",
                cell: "text-center text-sm p-0 relative w-8 sm:w-9 h-8 sm:h-9",
                day: "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal flex items-center justify-center",
              }}
            />
          </div>
          <div className="border-t sm:border-t-0 sm:border-l p-2 sm:p-3 flex flex-col justify-center">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4" />
              <Label className="text-sm font-medium">Waktu</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="09"
                  value={hours}
                  onChange={handleHoursChange}
                  className="text-center h-8 text-sm"
                  maxLength={2}
                  disabled={disabled}
                />
                <Label className="text-xs text-muted-foreground mt-1 block text-center">Jam</Label>
              </div>
              <span className="text-base font-bold">:</span>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="00"
                  value={minutes}
                  onChange={handleMinutesChange}
                  className="text-center h-8 text-sm"
                  maxLength={2}
                  disabled={disabled}
                />
                <Label className="text-xs text-muted-foreground mt-1 block text-center">Menit</Label>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const now = new Date();
                handleTimeChange(
                  String(now.getHours()).padStart(2, '0'),
                  String(now.getMinutes()).padStart(2, '0')
                );
              }}
              disabled={disabled}
              className="w-full text-xs h-7"
            >
              Sekarang
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;