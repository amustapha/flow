'use client';

import { useState } from 'react';
import { AppLayout, Sidebar } from '@/components';
import {
  CalendarHeader,
  DateNavigation,
  DayViewGrid,
  ReminderCard,
} from '@/components/calendar';
import { useReminders } from '@/hooks';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { reminders, isLoading, error } = useReminders(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <AppLayout sidebar={<Sidebar />}>
      <div className="flex h-full flex-col">
        <CalendarHeader
          month={monthNames[currentDate.getMonth()]}
          year={currentDate.getFullYear()}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <DateNavigation
            currentDate={currentDate}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
          />
        </div>

        <DayViewGrid date={currentDate}>
          {error && (
            <div className="col-span-full flex items-center justify-center p-8">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-medium">Failed to load reminders</p>
                <p className="mt-1 text-red-600">{error.message}</p>
              </div>
            </div>
          )}
          {!isLoading && !error && reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onClick={() => console.log('Clicked:', reminder)}
            />
          ))}
        </DayViewGrid>
      </div>
    </AppLayout>
  );
}
