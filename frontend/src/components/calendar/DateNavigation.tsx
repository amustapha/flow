'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface DateNavigationProps {
  /**
   * Current date to display
   */
  currentDate: Date;
  /**
   * View type (day or week)
   */
  view: 'day' | 'week';
  /**
   * Callback when previous period is clicked
   */
  onPrevious: () => void;
  /**
   * Callback when next period is clicked
   */
  onNext: () => void;
  /**
   * Callback when today button is clicked
   */
  onToday: () => void;
}

export function DateNavigation({ currentDate, view, onPrevious, onNext, onToday }: DateNavigationProps) {
  const formatDayView = (date: Date) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();

    return (
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-gray-500">{dayName}</span>
        <span className="text-xl font-semibold text-gray-900">{day}</span>
      </div>
    );
  };

  const formatWeekView = (date: Date) => {
    // Get start of week (Sunday)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    // Get end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-gray-500">
          {monthNames[startOfWeek.getMonth()]} {startOfWeek.getDate()} - {monthNames[endOfWeek.getMonth()]} {endOfWeek.getDate()}
        </span>
      </div>
    );
  };

  const isToday = () => {
    const today = new Date();
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex items-center gap-4">
      {/* Today Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onToday}
        className={cn(
          'min-w-[80px]',
          isToday() && 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        )}
      >
        Today
      </Button>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          aria-label={`Previous ${view}`}
          className="h-9 w-9 p-0"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          aria-label={`Next ${view}`}
          className="h-9 w-9 p-0"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Date Display */}
      <div className="min-w-[200px]">
        {view === 'day' ? formatDayView(currentDate) : formatWeekView(currentDate)}
      </div>
    </div>
  );
}
