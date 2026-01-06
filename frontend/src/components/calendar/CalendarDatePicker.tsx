'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Calendar } from '@/components/ui';

export interface CalendarDatePickerProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarDatePicker({ currentDate, onDateSelect }: CalendarDatePickerProps) {
  return (
    <Popover>
      {({ close }) => (
        <>
          <PopoverButton className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 transition-colors hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
            <CalendarIcon className="h-6 w-6 text-purple-600" />
          </PopoverButton>
          <PopoverPanel
            anchor="bottom start"
            className="z-10 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
          >
            <Calendar
              initialDate={currentDate}
              onDateSelect={(date) => {
                onDateSelect(date);
                close();
              }}
            />
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
