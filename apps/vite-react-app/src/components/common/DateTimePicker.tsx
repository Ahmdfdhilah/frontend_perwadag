import React from 'react';
import { Calendar } from '@workspace/ui/components/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Calendar1, CalendarIcon, Clock } from 'lucide-react';
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
      setHours(newHours);
      if (newHours.length === 2) {
        handleTimeChange(newHours);
      }
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = e.target.value;
    if (/^\d{0,2}$/.test(newMinutes) && (newMinutes === '' || (parseInt(newMinutes) >= 0 && parseInt(newMinutes) <= 59))) {
      setMinutes(newMinutes);
      if (newMinutes.length === 2) {
        handleTimeChange(undefined, newMinutes);
      }
    }
  };

  const getDisabledDates = (date: Date) => {
    if (disabledDates && disabledDates(date)) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent
        className="[&>button]:hidden w-[95vw] max-w-md max-h-[80vh] flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar1 className="h-4 w-4" />
            <Label className="text-sm font-medium">Tanggal</Label>
          </div>
          <div className="flex justify-center w-full mb-4">

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={getDisabledDates}
              initialFocus
              fixedWeeks={false}
              defaultMonth={selectedDate || new Date()}
            />
          </div>
          <div className="border-t pt-3">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4" />
              <Label className="text-sm font-medium">Jam</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
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
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t p-3">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={disabled}
              className="text-sm"
            >
              Batal
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (selectedDate) {
                  const finalDateTime = new Date(selectedDate);
                  finalDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                  onChange(finalDateTime);
                }
                setIsOpen(false);
              }}
              disabled={disabled || !selectedDate}
              className="text-sm"
            >
              Simpan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateTimePicker;