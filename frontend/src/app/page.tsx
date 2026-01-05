'use client';

import { useState } from 'react';
import { AppLayout, Sidebar } from '@/components';
import {
  CalendarHeader,
  DateNavigation,
  DayViewGrid,
  ReminderCard,
} from '@/components/calendar';
import {
  ReminderDetailModal,
  CreateReminderModal,
} from '@/components/reminder';
import { useReminders } from '@/hooks';
import { Reminder } from '@/types';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { reminders, isLoading } = useReminders(currentDate);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState<Reminder | null>(null);

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

  const handleReminderClick = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsDetailModalOpen(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setIsDetailModalOpen(false);
    setReminderToEdit(reminder);
    setIsCreateModalOpen(true);
  };

  const handleDeleteReminder = (reminder: Reminder) => {
    console.log('Delete reminder:', reminder);
    setIsDetailModalOpen(false);
    // TODO: Implement delete functionality
  };

  const handleSaveReminder = (reminderData: Partial<Reminder>) => {
    console.log('Save reminder:', reminderData);
    setIsCreateModalOpen(false);
    setReminderToEdit(null);
    // TODO: Implement save functionality
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReminder(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setReminderToEdit(null);
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
              reminder={reminder}
              onClick={() => handleReminderClick(reminder)}
            />
          ))}
        </DayViewGrid>
      </div>

      <ReminderDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        reminder={selectedReminder}
        onEdit={handleEditReminder}
        onDelete={handleDeleteReminder}
      />

      <CreateReminderModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveReminder}
        reminder={reminderToEdit}
      />
    </AppLayout>
  );
}
