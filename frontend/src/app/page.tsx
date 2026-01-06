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
  ConfirmDeleteModal,
} from '@/components/reminder';
import { useReminders } from '@/hooks';
import { Reminder, ReminderCreate, ReminderUpdate } from '@/types';
import { MONTH_NAMES } from '@/lib/constants';
import { reminderService } from '@/services';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { reminders, isLoading, error, refetch } = useReminders(currentDate);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState<Reminder | null>(null);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);
  const [initialDateTime, setInitialDateTime] = useState<Date | undefined>(undefined);

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
    setReminderToDelete(reminder);
    setIsDetailModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (reminder: Reminder) => {
    try {
      await reminderService.delete(reminder.id);
      setIsDeleteModalOpen(false);
      setReminderToDelete(null);
      refetch();
    } catch (err) {
      console.error('Failed to delete reminder:', err);
      // TODO: Show error toast/notification
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setReminderToDelete(null);
  };

  const handleSaveReminder = async (reminderData: ReminderCreate | ReminderUpdate) => {
    try {
      if (reminderToEdit) {
        // Update existing reminder
        await reminderService.update(reminderToEdit.id, reminderData as ReminderUpdate);
      } else {
        // Create new reminder
        await reminderService.create(reminderData as ReminderCreate);
      }
      setIsCreateModalOpen(false);
      setReminderToEdit(null);
      refetch();
    } catch (err) {
      console.error('Failed to save reminder:', err);
      // TODO: Show error toast/notification
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReminder(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setReminderToEdit(null);
    setInitialDateTime(undefined);
  };

  const handleCreateReminder = () => {
    setReminderToEdit(null);
    setInitialDateTime(undefined);
    setIsCreateModalOpen(true);
  };

  const handleEmptySpaceClick = (time: Date) => {
    setReminderToEdit(null);
    setInitialDateTime(time);
    setIsCreateModalOpen(true);
  };

  return (
    <AppLayout sidebar={<Sidebar onCreateReminder={handleCreateReminder} />}>
      <div className="flex h-full flex-col">
        <CalendarHeader
          month={MONTH_NAMES[currentDate.getMonth()]}
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

        <DayViewGrid date={currentDate} onEmptySpaceClick={handleEmptySpaceClick}>
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
        initialDateTime={initialDateTime}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        reminder={reminderToDelete}
        onConfirm={handleConfirmDelete}
      />
    </AppLayout>
  );
}
