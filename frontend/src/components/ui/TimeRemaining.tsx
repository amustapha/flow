'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow, isPast, differenceInSeconds } from 'date-fns';
import { cn } from '@/lib/utils';

export interface TimeRemainingProps {
  targetDate: Date;
  className?: string;
  showIcon?: boolean;
}

export function TimeRemaining({ targetDate, className, showIcon = false }: TimeRemainingProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const secondsDiff = differenceInSeconds(targetDate, now);
      const overdue = isPast(targetDate);

      setIsOverdue(overdue);

      if (overdue) {
        setTimeRemaining(formatDistanceToNow(targetDate, { addSuffix: true }));
      } else {
        // For upcoming reminders, show more precise time
        if (secondsDiff < 60) {
          setTimeRemaining(`in ${secondsDiff} second${secondsDiff !== 1 ? 's' : ''}`);
        } else if (secondsDiff < 3600) {
          const minutes = Math.floor(secondsDiff / 60);
          setTimeRemaining(`in ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        } else {
          setTimeRemaining(formatDistanceToNow(targetDate, { addSuffix: true }));
        }
      }
    };

    updateTimeRemaining();

    // Update every second for more accurate countdown
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-sm',
        isOverdue ? 'text-gray-500' : 'text-purple-600 font-medium',
        className
      )}
    >
      {showIcon && (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      {timeRemaining}
    </span>
  );
}
