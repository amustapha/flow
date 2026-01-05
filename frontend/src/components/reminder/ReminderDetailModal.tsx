'use client';

import { Modal } from '@/components/ui';
import { Reminder } from '@/types';
import { Button } from '@/components/ui';

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

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
      default:
        return 'bg-blue-100 text-blue-800';
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
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                reminder.status
              )}`}
            >
              {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
            </span>
          </div>
        )}

        {/* Message */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Message</h4>
          <p className="text-sm text-gray-900">{reminder.message}</p>
        </div>

        {/* Phone Number */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Phone Number</h4>
          <p className="text-sm text-gray-900">{reminder.phoneNumber}</p>
        </div>

        {/* Date and Time */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Scheduled For</h4>
          <p className="text-sm text-gray-900">
            {formatDateTime(reminder.scheduledTime, reminder.timezone)}
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
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
