'use client';

import { useCallback, useState } from 'react';
import { Reminder, ReminderCreate, ReminderUpdate } from '@/types';
import { reminderService } from '@/services';

export interface UseReminderOperationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useReminderOperations(options: UseReminderOperationsOptions = {}) {
  const { onSuccess, onError } = options;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreate = useCallback(async (data: ReminderCreate): Promise<Reminder | null> => {
    setIsProcessing(true);
    try {
      const reminder = await reminderService.create(data);
      onSuccess?.();
      return reminder;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create reminder');
      console.error('Failed to create reminder:', error);
      onError?.(error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [onSuccess, onError]);

  const handleUpdate = useCallback(async (id: string, data: ReminderUpdate): Promise<Reminder | null> => {
    setIsProcessing(true);
    try {
      const reminder = await reminderService.update(id, data);
      onSuccess?.();
      return reminder;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update reminder');
      console.error('Failed to update reminder:', error);
      onError?.(error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [onSuccess, onError]);

  const handleDelete = useCallback(async (id: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      await reminderService.delete(id);
      onSuccess?.();
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete reminder');
      console.error('Failed to delete reminder:', error);
      onError?.(error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [onSuccess, onError]);

  const handleSave = useCallback(async (
    data: ReminderCreate | ReminderUpdate,
    existingReminder?: Reminder | null
  ): Promise<Reminder | null> => {
    if (existingReminder) {
      return handleUpdate(existingReminder.id, data as ReminderUpdate);
    }
    return handleCreate(data as ReminderCreate);
  }, [handleCreate, handleUpdate]);

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSave,
    isProcessing,
  };
}
