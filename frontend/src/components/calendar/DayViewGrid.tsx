'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface DayViewGridProps {
  date: Date;
  children?: React.ReactNode;
}

export function DayViewGrid({ date, children }: DayViewGridProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const getCurrentTimePosition = () => {
    if (!currentTime || !isToday()) return null;

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const percentageOfDay = (totalMinutes / (24 * 60)) * 100;

    return percentageOfDay;
  };

  const isToday = () => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="relative flex-1 overflow-y-auto bg-white">
      <div className="relative min-h-[1440px]">
        <div className="absolute left-0 top-0 w-20 border-r border-gray-200">
          {hours.map((hour) => (
            <div key={hour} className="h-15 border-b border-gray-100">
              <span className="block pr-2 pt-1 text-right text-xs text-gray-500">
                {formatHour(hour)}
              </span>
            </div>
          ))}
        </div>

        <div className="ml-20">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-15 border-b border-gray-100"
            />
          ))}

          {currentTimePosition !== null && (
            <div
              className="absolute left-20 right-0 z-10 flex items-center"
              style={{ top: `${currentTimePosition}%` }}
            >
              <div className="h-0.5 w-full bg-red-500" />
              <div className="absolute -left-1 h-3 w-3 rounded-full bg-red-500" />
            </div>
          )}

          <div className="absolute left-20 right-0 top-0 bottom-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
