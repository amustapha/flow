'use client';

import { useState } from 'react';
import { AppLayout, Sidebar } from '@/components';
import {
  CalendarHeader,
  ViewSelector,
  DateNavigation,
  DayViewGrid,
  WeekViewGrid,
  ReminderCard,
  CalendarView,
} from '@/components/calendar';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<CalendarView>('day');

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
    if (activeView === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (activeView === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Sample reminders for testing
  const sampleReminders = [
    {
      id: 1,
      title: 'Team Meeting',
      time: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 30),
      color: 'purple' as const,
    },
    {
      id: 2,
      title: 'Dentist Appointment',
      time: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 14, 0),
      color: 'blue' as const,
    },
    {
      id: 3,
      title: 'Gym Session',
      time: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 18, 30),
      color: 'green' as const,
    },
  ];

  return (
    <AppLayout sidebar={<Sidebar />}>
      <div className="flex h-full flex-col">
        {/* Calendar Header */}
        <CalendarHeader
          month={monthNames[currentDate.getMonth()]}
          year={currentDate.getFullYear()}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        {/* Controls Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <DateNavigation
            currentDate={currentDate}
            view={activeView}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
          />
          <ViewSelector
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>

        {/* Calendar Grid */}
        {activeView === 'day' ? (
          <DayViewGrid date={currentDate}>
            {sampleReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                title={reminder.title}
                time={reminder.time}
                color={reminder.color}
                onClick={() => console.log('Clicked:', reminder.title)}
              />
            ))}
          </DayViewGrid>
        ) : (
          <WeekViewGrid date={currentDate}>
            {sampleReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                title={reminder.title}
                time={reminder.time}
                color={reminder.color}
                onClick={() => console.log('Clicked:', reminder.title)}
              />
            ))}
          </WeekViewGrid>
        )}
      </div>
    </AppLayout>
  );
}
