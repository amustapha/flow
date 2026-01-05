'use client';

import { cn } from '@/lib/utils';

export interface ReminderCardProps {
  /**
   * Reminder title
   */
  title: string;
  /**
   * Scheduled time (Date object)
   */
  time: Date;
  /**
   * Optional color for the reminder
   */
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red';
  /**
   * Click handler to open reminder details
   */
  onClick?: () => void;
  /**
   * Number of overlapping reminders at this time (for horizontal stacking)
   */
  overlapIndex?: number;
  /**
   * Total number of overlapping reminders
   */
  totalOverlaps?: number;
}

export function ReminderCard({
  title,
  time,
  color = 'purple',
  onClick,
  overlapIndex = 0,
  totalOverlaps = 1,
}: ReminderCardProps) {
  const colorClasses = {
    purple: 'bg-purple-100 border-purple-400 text-purple-900 hover:bg-purple-200',
    blue: 'bg-blue-100 border-blue-400 text-blue-900 hover:bg-blue-200',
    green: 'bg-green-100 border-green-400 text-green-900 hover:bg-green-200',
    orange: 'bg-orange-100 border-orange-400 text-orange-900 hover:bg-orange-200',
    red: 'bg-red-100 border-red-400 text-red-900 hover:bg-red-200',
  };

  // Calculate position based on time
  const getPosition = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // 60px per hour, calculate percentage
    const topPercentage = (totalMinutes / (24 * 60)) * 100;

    return {
      top: `${topPercentage}%`,
    };
  };

  // Calculate width and left offset for overlapping reminders
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
        'absolute cursor-pointer rounded-lg border-l-4 p-2 shadow-sm transition-all',
        colorClasses[color],
        onClick && 'hover:shadow-md'
      )}
      style={{
        ...position,
        ...overlapStyle,
        height: '60px', // Fixed height for all reminders
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
