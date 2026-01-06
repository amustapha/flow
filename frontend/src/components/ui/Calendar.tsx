'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { MONTH_NAMES, DAY_NAMES_ABBREV } from '@/lib/constants';

export interface CalendarProps {
  /**
   * Optional initial date to display
   */
  initialDate?: Date;
  /**
   * Callback when a date is selected
   */
  onDateSelect?: (date: Date) => void;
  /**
   * Optional CSS class name
   */
  className?: string;
}

export function Calendar({ initialDate, onDateSelect, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(year, month, day);
    onDateSelect?.(selectedDate);
  };

  const renderDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day &&
                      today.getMonth() === month &&
                      today.getFullYear() === year;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            'h-9 w-9 text-sm flex items-center justify-center rounded-full transition-colors',
            isToday
              ? 'bg-purple-600 text-white font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={cn('', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={previousMonth}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {DAY_NAMES_ABBREV.map(day => (
          <div key={day} className="h-9 w-9 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
}
