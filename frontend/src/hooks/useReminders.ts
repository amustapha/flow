'use client';

import { useState, useEffect } from 'react';
import { Reminder } from '@/types';
import { reminderService } from '@/services';
import { useSettings } from '@/contexts';

export interface UseRemindersOptions {
  date?: Date;
  page?: number;
  pageSize?: number;
  status?: string;
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
          status?: string;
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
          // Ensure datetime strings are parsed as UTC by appending 'Z' if missing
          scheduled_time: new Date(
            typeof item.scheduled_time === 'string' && !item.scheduled_time.endsWith('Z')
              ? `${item.scheduled_time}Z`
              : item.scheduled_time
          ),
          created_at: item.created_at
            ? new Date(
                typeof item.created_at === 'string' && !item.created_at.endsWith('Z')
                  ? `${item.created_at}Z`
                  : item.created_at
              )
            : undefined,
          updated_at: item.updated_at
            ? new Date(
                typeof item.updated_at === 'string' && !item.updated_at.endsWith('Z')
                  ? `${item.updated_at}Z`
                  : item.updated_at
              )
            : undefined,
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

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { reminders, total, isLoading, error, refetch };
}
