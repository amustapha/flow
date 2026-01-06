'use client';

import { differenceInMinutes, getHours, getMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { REMINDER_THRESHOLDS } from '@/lib/constants';
import { Reminder } from '@/types';
import { useSettings } from '@/contexts';

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
  const { timezone } = useSettings();
  const { title, scheduled_time, phone_number } = reminder;

  // Convert UTC time to selected timezone
  const timeInZone = toZonedTime(scheduled_time, timezone);

  const getColor = () => {
    const now = new Date();
    const minutesDiff = differenceInMinutes(scheduled_time, now);

    if (minutesDiff < REMINDER_THRESHOLDS.PAST_GRACE_PERIOD) {
      return 'gray';
    } else if (
      minutesDiff >= REMINDER_THRESHOLDS.PAST_GRACE_PERIOD &&
      minutesDiff <= REMINDER_THRESHOLDS.UPCOMING_WINDOW
    ) {
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
    const hours = getHours(timeInZone);
    const minutes = getMinutes(timeInZone);
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
        <div>
          <p className="truncate text-sm font-semibold" title={title}>
            {title}
          </p>
          <p className="text-xs opacity-75 mt-1">{phone_number}</p>
        </div>
      </div>
    </div>
  );
}
