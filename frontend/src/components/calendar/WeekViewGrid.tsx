'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface WeekViewGridProps {
  /**
   * Current date (week will be calculated from this)
   */
  date: Date;
  /**
   * Optional children (reminder cards)
   */
  children?: React.ReactNode;
}

export function WeekViewGrid({ date, children }: WeekViewGridProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Generate time slots (24 hours)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Get week days starting from Sunday
  const getWeekDays = () => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const isToday = (day: Date) => {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  // Calculate current time indicator position
  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const percentageOfDay = (totalMinutes / (24 * 60)) * 100;

    return percentageOfDay;
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="relative flex-1 overflow-y-auto bg-white">
      {/* Day headers */}
      <div className="sticky top-0 z-20 flex border-b border-gray-200 bg-white">
        <div className="w-20 border-r border-gray-200" />
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-1 flex-col items-center justify-center py-3 border-r border-gray-200',
              isToday(day) && 'bg-purple-50'
            )}
          >
            <span className="text-xs font-medium text-gray-500">
              {dayNames[index]}
            </span>
            <span
              className={cn(
                'mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                isToday(day)
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-900'
              )}
            >
              {day.getDate()}
            </span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="relative min-h-[1440px]">
        {/* Time labels */}
        <div className="absolute left-0 top-0 w-20 border-r border-gray-200">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b border-gray-100">
              <span className="block pr-2 pt-1 text-right text-xs text-gray-500">
                {formatHour(hour)}
              </span>
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div className="ml-20 flex">
          {weekDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={cn(
                'relative flex-1 border-r border-gray-200',
                isToday(day) && 'bg-purple-50/30'
              )}
            >
              {/* Grid lines */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-[60px] border-b border-gray-100"
                />
              ))}

              {/* Current time indicator for today */}
              {isToday(day) && (
                <div
                  className="absolute left-0 right-0 z-10 flex items-center"
                  style={{ top: `${currentTimePosition}%` }}
                >
                  <div className="h-0.5 w-full bg-red-500" />
                  {dayIndex === 0 && (
                    <div className="absolute -left-1 h-3 w-3 rounded-full bg-red-500" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reminder cards container */}
        <div className="absolute left-20 right-0 top-0 bottom-0">
          {children}
        </div>
      </div>
    </div>
  );
}
