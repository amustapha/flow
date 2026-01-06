'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { CalendarDatePicker } from './CalendarDatePicker';

export interface CalendarHeaderProps {
  month: string;
  year: number;
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
}

export function CalendarHeader({ month, year, currentDate, onPreviousMonth, onNextMonth, onDateSelect }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <CalendarDatePicker currentDate={currentDate} onDateSelect={onDateSelect} />
        <h2 className="text-2xl font-semibold text-gray-900">
          {month} {year}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousMonth}
          aria-label="Previous month"
          className="h-9 w-9 p-0"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextMonth}
          aria-label="Next month"
          className="h-9 w-9 p-0"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
