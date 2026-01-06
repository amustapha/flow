'use client';

import { useState, useEffect } from 'react';
import { Reminder } from '@/types';
import { reminderService } from '@/services';

export function useReminders(date: Date) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
          scheduled_time: new Date(item.scheduled_time),
          created_at: item.created_at ? new Date(item.created_at) : undefined,
          updated_at: item.updated_at ? new Date(item.updated_at) : undefined,
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
  }, [date]);

  return { reminders, isLoading, error };
}
