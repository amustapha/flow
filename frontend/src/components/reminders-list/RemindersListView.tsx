'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAllReminders } from '@/hooks';
import { useSettings } from '@/contexts';
import { Button, Badge, TimeRemaining } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Reminder } from '@/types';

export interface RemindersListViewProps {
  onReminderClick?: (reminder: Reminder) => void;
  pageSize?: number;
}

export function RemindersListView({
  onReminderClick,
  pageSize = 5,
}: RemindersListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { reminders, total, isLoading, error } = useAllReminders(currentPage, pageSize);
  const { timezone } = useSettings();

  const totalPages = Math.ceil(total / pageSize);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">Failed to load reminders</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">All Reminders</h3>
        <span className="text-xs text-gray-500">{total} total</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(pageSize)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : reminders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-500">No reminders found</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {reminders.map((reminder) => {
              const timeInZone = toZonedTime(reminder.scheduled_time, timezone);
              const isPast = new Date() > reminder.scheduled_time;

              return (
                <div
                  key={reminder.id}
                  className={cn(
                    'cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-purple-300 hover:shadow-sm',
                    isPast && 'opacity-60'
                  )}
                  onClick={() => onReminderClick?.(reminder)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {reminder.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {format(timeInZone, 'MMM d, yyyy h:mm a')}
                      </p>
                      <div className="mt-1">
                        <TimeRemaining targetDate={reminder.scheduled_time} className="text-xs" />
                      </div>
                    </div>
                    {reminder.status && (
                      <Badge className={cn('text-xs', getStatusColor(reminder.status))}>
                        {reminder.status}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="h-8 px-2"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>

              <span className="text-xs text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 px-2"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
