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
  const { reminders, isLoading } = useReminders(currentDate);

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
          {!isLoading && reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              title={reminder.title}
              time={reminder.scheduledTime}
              color={reminder.color}
              onClick={() => console.log('Clicked:', reminder.title)}
            />
          ))}
        </DayViewGrid>
      </div>
    </AppLayout>
  );
}
