'use client';

import { useState, useEffect } from 'react';
import { Reminder } from '@/types';
import { reminderService } from '@/services';

export function useReminders(date: Date) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchReminders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const dateStr = date.toISOString().split('T')[0];

        const response = await reminderService.list({
          date: dateStr,
        });

        const remindersList: Reminder[] = response.items.map((item) => ({
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

        setReminders(remindersList);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch reminders'));
        setReminders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, [date, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { reminders, isLoading, error, refetch };
}
