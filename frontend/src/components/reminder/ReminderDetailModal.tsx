'use client';

import { Modal, Button, Countdown, StatusBadge } from '@/components/ui';
import { Reminder } from '@/types';
import { useSettings } from '@/contexts';

export interface ReminderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: Reminder | null;
  onEdit?: (reminder: Reminder) => void;
  onDelete?: (reminder: Reminder) => void;
}

export function ReminderDetailModal({
  isOpen,
  onClose,
  reminder,
  onEdit,
  onDelete,
}: ReminderDetailModalProps) {
  const { timezone } = useSettings();

  if (!reminder) {
    return null;
  }

  const formatDateTime = (date: Date, timezone: string) => {
    try {
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timezone,
      });

      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone,
      });

      return `${dateStr} at ${timeStr}`;
    } catch {
      // Fallback if timezone is invalid
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  const handleEdit = () => {
    onEdit?.(reminder);
  };

  const handleDelete = () => {
    onDelete?.(reminder);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={reminder.title} size="lg">
      <div className="space-y-4">
        {/* Status Badge */}
        {reminder.status && (
          <div className="flex items-center">
            <StatusBadge status={reminder.status} size="sm" />
          </div>
        )}

        {/* Time Remaining */}
        <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-700">Time Remaining:</h4>
            <Countdown targetDate={reminder.scheduled_time} variant="primary" size="md" />
          </div>
        </div>

        {/* Message */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Message</h4>
          <p className="text-sm text-gray-900">{reminder.message}</p>
        </div>

        {/* Phone Number */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Phone Number</h4>
          <p className="text-sm text-gray-900">{reminder.phone_number}</p>
        </div>

        {/* Date and Time */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Scheduled For</h4>
          <p className="text-sm text-gray-900">
            {formatDateTime(reminder.scheduled_time, timezone)}
          </p>
        </div>

        {/* Timezone */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Timezone</h4>
          <p className="text-sm text-gray-900">{reminder.timezone}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button variant="primary" onClick={handleEdit} className="flex-1">
            Edit
          </Button>
          <Button variant="secondary" onClick={handleDelete} className="flex-1">
            Cancel Reminder
          </Button>
        </div>
      </div>
    </Modal>
  );
}
