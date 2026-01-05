'use client';

import { useState, useEffect } from 'react';
import { Reminder } from '@/types';

export function useReminders(date: Date) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 100));

      const sampleReminders: Reminder[] = [
        {
          id: '1',
          title: 'Team Meeting',
          message: 'Join the weekly team sync meeting to discuss project updates',
          phoneNumber: '+14155552671',
          scheduledTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 30),
          timezone: 'America/Los_Angeles',
          status: 'pending',
        },
        {
          id: '2',
          title: 'Dentist Appointment',
          message: 'Remember your dentist appointment at 2 PM',
          phoneNumber: '+14155552671',
          scheduledTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14, 0),
          timezone: 'America/Los_Angeles',
          status: 'pending',
        },
        {
          id: '3',
          title: 'Gym Session',
          message: 'Time for your evening workout at the gym',
          phoneNumber: '+14155552671',
          scheduledTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 30),
          timezone: 'America/Los_Angeles',
          status: 'pending',
        },
      ];

      setReminders(sampleReminders);
      setIsLoading(false);
    };

    fetchReminders();
  }, [date]);

  return { reminders, isLoading };
}
