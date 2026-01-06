'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Badge } from './Badge';

export interface CountdownProps {
  targetDate: Date;
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Countdown({
  targetDate,
  variant = 'default',
  size = 'md',
  className
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      setTimeLeft('00:00:00');
      return;
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    setTimeLeft(formattedTime);
  }, [targetDate]);

  useEffect(() => {
    const startInterval = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(calculateTimeLeft, 1000);
      }
    };

    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval();
      } else {
        calculateTimeLeft();
        startInterval();
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Start interval only if page is visible
    if (!document.hidden) {
      startInterval();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [calculateTimeLeft]);

  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <Badge variant={variant} size={size} className={className}>
      <ClockIcon className={`${iconSize} mr-1`} />
      {timeLeft}
    </Badge>
  );
}
