'use client';

import { useState } from 'react';
import { AppLayout, Sidebar, ErrorBoundary } from '@/components';
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
import { SettingsModal } from '@/components/settings';
import { useReminders, useModalManager, useReminderOperations } from '@/hooks';
import { ReminderCreate, ReminderUpdate } from '@/types';
import { MONTH_NAMES } from '@/lib/constants';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sidebarRefetchTrigger, setSidebarRefetchTrigger] = useState(0);

  const { reminders, isLoading, error, refetch } = useReminders({ date: currentDate });

  const modals = useModalManager();

  const triggerRefetch = () => {
    refetch();
    setSidebarRefetchTrigger((prev) => prev + 1);
  };

  const operations = useReminderOperations({
    onSuccess: triggerRefetch,
  });

  // Calendar navigation handlers
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

  // Modal action handlers
  const handleSaveReminder = async (reminderData: ReminderCreate | ReminderUpdate) => {
    const result = await operations.handleSave(reminderData, modals.reminderToEdit);
    if (result) {
      modals.closeCreateModal();
    }
  };

  const handleConfirmDelete = async () => {
    if (modals.reminderToDelete) {
      const success = await operations.handleDelete(modals.reminderToDelete.id);
      if (success) {
        modals.closeDeleteModal();
      }
    }
  };

  const handleEmptySpaceClick = (time: Date) => {
    modals.openCreateModal(undefined, time);
  };

  const handleCreateReminder = () => {
    modals.openCreateModal();
  };

  return (
    <ErrorBoundary>
      <AppLayout
        sidebar={
          <Sidebar
            onCreateReminder={handleCreateReminder}
            onOpenSettings={modals.openSettingsModal}
            onReminderClick={modals.openDetailModal}
            refetchTrigger={sidebarRefetchTrigger}
          />
        }
      >
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
                onClick={() => modals.openDetailModal(reminder)}
              />
            ))}
          </DayViewGrid>
        </div>

        <ReminderDetailModal
          isOpen={modals.isDetailModalOpen}
          onClose={modals.closeDetailModal}
          reminder={modals.selectedReminder}
          onEdit={modals.openEditFromDetail}
          onDelete={modals.openDeleteModal}
        />

        <CreateReminderModal
          isOpen={modals.isCreateModalOpen}
          onClose={modals.closeCreateModal}
          onSave={handleSaveReminder}
          reminder={modals.reminderToEdit}
          initialDateTime={modals.initialDateTime}
        />

        <ConfirmDeleteModal
          isOpen={modals.isDeleteModalOpen}
          onClose={modals.closeDeleteModal}
          reminder={modals.reminderToDelete}
          onConfirm={handleConfirmDelete}
        />

        <SettingsModal
          isOpen={modals.isSettingsModalOpen}
          onClose={modals.closeSettingsModal}
        />
      </AppLayout>
    </ErrorBoundary>
  );
}
