'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { DAY_NAMES, isToday } from '@/lib';

export interface DateNavigationProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function DateNavigation({ currentDate, onPrevious, onNext, onToday }: DateNavigationProps) {
  const isTodaySelected = isToday(currentDate);

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={onToday}
        className={cn(
          'min-w-20',
          isTodaySelected && 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        )}
      >
        Today
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          aria-label="Previous day"
          className="h-9 w-9 p-0"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          aria-label="Next day"
          className="h-9 w-9 p-0"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="min-w-50">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-gray-500">{DAY_NAMES[currentDate.getDay()]}</span>
          <span className="text-xl font-semibold text-gray-900">{currentDate.getDate()}</span>
        </div>
      </div>
    </div>
  );
}
