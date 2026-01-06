'use client';

import { useEffect, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { useSettings } from '@/contexts';
import { isTodayInTimezone, TIME_GRID } from '@/lib';

export interface DayViewGridProps {
  date: Date;
  children?: React.ReactNode;
  onEmptySpaceClick?: (time: Date) => void;
}

export function DayViewGrid({ date, children, onEmptySpaceClick }: DayViewGridProps) {
  const { timezone } = useSettings();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client only to avoid hydration mismatch
    // We get the current system time (UTC-based) and will convert to timezone later
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []); // Intentionally no timezone dependency - we always want actual current time

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onEmptySpaceClick) return;

    // Only trigger if clicking on the grid itself, not on child elements
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentageOfDay = y / rect.height;
    const totalMinutes = Math.round(percentageOfDay * 24 * 60);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor((totalMinutes % 60) / TIME_GRID.SNAP_INTERVAL_MINUTES) * TIME_GRID.SNAP_INTERVAL_MINUTES;

    const clickedTime = new Date(date);
    clickedTime.setHours(hours, minutes, 0, 0);

    onEmptySpaceClick(clickedTime);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const isCurrentDay = isTodayInTimezone(date, timezone);

  const getCurrentTimePosition = () => {
    if (!currentTime || !isCurrentDay) return null;

    // Convert current time to selected timezone
    const timeInZone = toZonedTime(currentTime, timezone);
    const hours = timeInZone.getHours();
    const minutes = timeInZone.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const percentageOfDay = (totalMinutes / (24 * 60)) * 100;

    return percentageOfDay;
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

          <div
            className="absolute left-20 right-0 top-0 bottom-0 cursor-pointer"
            onClick={handleGridClick}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
