'use client';

import { cn } from '@/lib/utils';
import { Reminder } from '@/types';

export interface ReminderCardProps {
  reminder: Reminder;
  onClick?: () => void;
  overlapIndex?: number;
  totalOverlaps?: number;
}

export function ReminderCard({
  reminder,
  onClick,
  overlapIndex = 0,
  totalOverlaps = 1,
}: ReminderCardProps) {
  const { title, scheduledTime: time } = reminder;
  const getColor = () => {
    const now = new Date();
    const timeDiff = time.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    if (minutesDiff < -5) {
      return 'gray';
    } else if (minutesDiff >= -5 && minutesDiff <= 15) {
      return 'purple';
    } else {
      return 'blue';
    }
  };

  const color = getColor();

  const colorClasses = {
    gray: 'bg-gray-100 border-gray-400 text-gray-900 hover:bg-gray-200',
    purple: 'bg-purple-100 border-purple-400 text-purple-900 hover:bg-purple-200',
    blue: 'bg-blue-100 border-blue-400 text-blue-900 hover:bg-blue-200',
  };

  const getPosition = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const topPercentage = (totalMinutes / (24 * 60)) * 100;

    return {
      top: `${topPercentage}%`,
    };
  };

  const getOverlapStyle = () => {
    if (totalOverlaps === 1) {
      return {
        width: '100%',
        left: '0%',
      };
    }

    const widthPercentage = 100 / totalOverlaps;
    const leftPercentage = widthPercentage * overlapIndex;

    return {
      width: `${widthPercentage}%`,
      left: `${leftPercentage}%`,
    };
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${displayHours}:${displayMinutes} ${period}`;
  };

  const position = getPosition();
  const overlapStyle = getOverlapStyle();

  return (
    <div
      className={cn(
        'absolute h-[60px] cursor-pointer rounded-lg border-l-4 p-2 shadow-sm transition-all',
        colorClasses[color],
        onClick && 'hover:shadow-md'
      )}
      style={{
        ...position,
        ...overlapStyle,
      }}
      onClick={onClick}
    >
      <div className="flex h-full flex-col justify-between">
        <p className="truncate text-sm font-semibold" title={title}>
          {title}
        </p>
        <p className="text-xs opacity-75">{formatTime(time)}</p>
      </div>
    </div>
  );
}
