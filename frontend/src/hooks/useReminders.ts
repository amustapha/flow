'use client';

import { useState, useEffect, useCallback } from 'react';
import { Reminder, ReminderStatus } from '@/types';
import { reminderService } from '@/services';
import { useSettings } from '@/contexts';
import { parseUTCDate, parseOptionalUTCDate } from '@/lib';

export interface UseRemindersOptions {
  date?: Date;
  page?: number;
  pageSize?: number;
  status?: ReminderStatus;
  searchQuery?: string;
}

export function useReminders(options: UseRemindersOptions = {}) {
  const { date, page, pageSize, status, searchQuery } = options;
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { timezone } = useSettings();

  useEffect(() => {
    const fetchReminders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params: {
          date?: string;
          page?: number;
          page_size?: number;
          timezone?: string;
          status?: ReminderStatus;
        } = {};

        if (date) {
          params.date = date.toISOString().split('T')[0];
        }

        if (page !== undefined) {
          params.page = page;
        }

        if (pageSize !== undefined) {
          params.page_size = pageSize;
        }

        if (timezone) {
          params.timezone = timezone;
        }

        if (status) {
          params.status = status;
        }

        const response = await reminderService.list(params);

        let remindersList: Reminder[] = response.items.map((item) => ({
          ...item,
          scheduled_time: parseUTCDate(item.scheduled_time),
          created_at: parseOptionalUTCDate(item.created_at),
          updated_at: parseOptionalUTCDate(item.updated_at),
        }));

        // Client-side filtering by search query
        if (searchQuery && searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();
          remindersList = remindersList.filter(
            (reminder) =>
              reminder.title.toLowerCase().includes(query) ||
              reminder.message.toLowerCase().includes(query)
          );
        }

        setReminders(remindersList);
        setTotal(searchQuery ? remindersList.length : response.total);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch reminders'));
        setReminders([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, [date, page, pageSize, timezone, status, searchQuery, refetchTrigger]);

  const refetch = useCallback(() => setRefetchTrigger((prev) => prev + 1), []);

  return { reminders, total, isLoading, error, refetch };
}
