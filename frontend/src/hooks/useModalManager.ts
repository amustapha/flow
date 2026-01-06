'use client';

import { useState, useCallback } from 'react';
import { Reminder } from '@/types';

export interface ModalState {
  isDetailModalOpen: boolean;
  isCreateModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isSettingsModalOpen: boolean;
  selectedReminder: Reminder | null;
  reminderToEdit: Reminder | null;
  reminderToDelete: Reminder | null;
  initialDateTime: Date | undefined;
}

const initialState: ModalState = {
  isDetailModalOpen: false,
  isCreateModalOpen: false,
  isDeleteModalOpen: false,
  isSettingsModalOpen: false,
  selectedReminder: null,
  reminderToEdit: null,
  reminderToDelete: null,
  initialDateTime: undefined,
};

export function useModalManager() {
  const [state, setState] = useState<ModalState>(initialState);

  const openDetailModal = useCallback((reminder: Reminder) => {
    setState((prev) => ({
      ...prev,
      selectedReminder: reminder,
      isDetailModalOpen: true,
    }));
  }, []);

  const closeDetailModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDetailModalOpen: false,
      selectedReminder: null,
    }));
  }, []);

  const openCreateModal = useCallback((reminder?: Reminder, initialDateTime?: Date) => {
    setState((prev) => ({
      ...prev,
      reminderToEdit: reminder ?? null,
      initialDateTime,
      isCreateModalOpen: true,
    }));
  }, []);

  const closeCreateModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isCreateModalOpen: false,
      reminderToEdit: null,
      initialDateTime: undefined,
    }));
  }, []);

  const openDeleteModal = useCallback((reminder: Reminder) => {
    setState((prev) => ({
      ...prev,
      reminderToDelete: reminder,
      isDeleteModalOpen: true,
      isDetailModalOpen: false,
    }));
  }, []);

  const closeDeleteModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDeleteModalOpen: false,
      reminderToDelete: null,
    }));
  }, []);

  const openSettingsModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSettingsModalOpen: true,
    }));
  }, []);

  const closeSettingsModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSettingsModalOpen: false,
    }));
  }, []);

  const openEditFromDetail = useCallback((reminder: Reminder) => {
    setState((prev) => ({
      ...prev,
      isDetailModalOpen: false,
      reminderToEdit: reminder,
      isCreateModalOpen: true,
    }));
  }, []);

  return {
    ...state,
    openDetailModal,
    closeDetailModal,
    openCreateModal,
    closeCreateModal,
    openDeleteModal,
    closeDeleteModal,
    openSettingsModal,
    closeSettingsModal,
    openEditFromDetail,
  };
}
