'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ChevronLeftIcon, ChevronRightIcon, BellIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useReminders } from '@/hooks';
import { useSettings } from '@/contexts';
import { Button, Badge, TimeRemaining, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Reminder } from '@/types';

export interface RemindersListViewProps {
  onReminderClick?: (reminder: Reminder) => void;
  onCreateReminder?: () => void;
  pageSize?: number;
}

export function RemindersListView({
  onReminderClick,
  onCreateReminder,
  pageSize = 5,
}: RemindersListViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { reminders, total, isLoading, error } = useReminders({
    page: currentPage,
    pageSize,
    status: statusFilter || undefined,
    searchQuery: searchQuery || undefined,
  });
  const { timezone } = useSettings();

  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery && searchQuery.trim() !== '') {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchQuery, pathname, router, searchParams]);

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Scheduled':
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

      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search reminders..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9 text-sm"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500">Status:</span>
        <button
          onClick={() => handleStatusFilterChange('')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            statusFilter === ''
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          All
        </button>
        <button
          onClick={() => handleStatusFilterChange('pending')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            statusFilter === 'pending'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Pending
        </button>
        <button
          onClick={() => handleStatusFilterChange('completed')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            statusFilter === 'completed'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Completed
        </button>
        <button
          onClick={() => handleStatusFilterChange('cancelled')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            statusFilter === 'cancelled'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Cancelled
        </button>
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
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <BellIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h4 className="mb-2 text-sm font-semibold text-gray-900">No reminders yet</h4>
          <p className="mb-4 text-xs text-gray-500">
            Get started by creating your first voice reminder
          </p>
          {onCreateReminder && (
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateReminder}
              className="mx-auto"
            >
              <BellIcon className="mr-2 h-4 w-4" />
              Create Reminder
            </Button>
          )}
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
                        {reminder.phone_number}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span>{format(timeInZone, 'MMM d, yyyy h:mm a')}</span>
                        <span className="text-gray-400">•</span>
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
