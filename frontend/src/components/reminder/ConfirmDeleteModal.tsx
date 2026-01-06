'use client';

import { Modal, Button } from '@/components/ui';
import { Reminder } from '@/types';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: Reminder | null;
  onConfirm: (reminder: Reminder) => void;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  reminder,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  if (!reminder) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(reminder);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Reminder"
      size="sm"
      showCloseButton={!isDeleting}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to cancel this reminder? This action cannot be undone.
        </p>

        <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{reminder.title}</h4>
          <p className="text-xs text-gray-600 line-clamp-2">{reminder.message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            isLoading={isDeleting}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
          >
            {isDeleting ? 'Cancelling...' : 'Cancel Reminder'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
