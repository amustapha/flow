'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Input, PhoneNumberInput, DatePicker, TimezoneInput } from '@/components/ui';
import { Reminder } from '@/types';
import { useSettings } from '@/contexts';
import { fromZonedTime } from 'date-fns-tz';
import {
  isValidPhoneNumber,
  isFutureDateTime,
  isNonEmptyString,
  isValidTimezone,
} from '@/lib';

export interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Partial<Reminder>) => void;
  reminder?: Reminder | null;
  isSaving?: boolean;
  initialDateTime?: Date;
}

// Form state extends Reminder fields but uses date/time separately for UI
type ReminderFormState = Pick<Reminder, 'title' | 'message' | 'phone_number' | 'timezone'> & {
  date: Date | undefined;
  time: string;
};

export function CreateReminderModal({
  isOpen,
  onClose,
  onSave,
  reminder,
  isSaving = false,
  initialDateTime,
}: CreateReminderModalProps) {
  const isEditMode = !!reminder;
  const { timezone: settingsTimezone } = useSettings();

  const [formData, setFormData] = useState<ReminderFormState>({
    title: '',
    message: '',
    phone_number: '',
    date: undefined,
    time: '',
    timezone: settingsTimezone,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReminderFormState, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ReminderFormState, boolean>>>({});

  // Initialize form data when reminder prop changes
  useEffect(() => {
    if (reminder) {
      const reminderDate = new Date(reminder.scheduled_time);
      const hours = reminderDate.getHours().toString().padStart(2, '0');
      const minutes = reminderDate.getMinutes().toString().padStart(2, '0');

      setFormData({
        title: reminder.title,
        message: reminder.message,
        phone_number: reminder.phone_number,
        date: reminderDate,
        time: `${hours}:${minutes}`,
        timezone: reminder.timezone,
      });
    } else {
      // Reset form for create mode
      let date = undefined;
      let time = '';

      if (initialDateTime) {
        date = initialDateTime;
        const hours = initialDateTime.getHours().toString().padStart(2, '0');
        const minutes = initialDateTime.getMinutes().toString().padStart(2, '0');
        time = `${hours}:${minutes}`;
      }

      setFormData({
        title: '',
        message: '',
        phone_number: '',
        date,
        time,
        timezone: settingsTimezone,
      });
    }
    setErrors({});
    setTouched({});
  }, [reminder, isOpen, initialDateTime, settingsTimezone]);

  const validateField = (name: keyof ReminderFormState, data: ReminderFormState = formData): string | undefined => {
    const validators: Record<keyof ReminderFormState, () => string | undefined> = {
      title: () => !isNonEmptyString(data.title) ? 'Title is required' : undefined,
      message: () => !isNonEmptyString(data.message) ? 'Message is required' : undefined,
      phone_number: () => {
        if (!data.phone_number) return 'Phone number is required';
        if (!isValidPhoneNumber(data.phone_number)) return 'Please enter a valid phone number';
        return undefined;
      },
      date: () => {
        if (!data.date) return 'Date is required';
        if (data.time && !isFutureDateTime(data.date, data.time)) return 'Date and time must be in the future';
        return undefined;
      },
      time: () => {
        if (!isNonEmptyString(data.time)) return 'Time is required';
        if (data.date && !isFutureDateTime(data.date, data.time)) return 'Date and time must be in the future';
        return undefined;
      },
      timezone: () => {
        if (!data.timezone) return 'Timezone is required';
        if (!isValidTimezone(data.timezone)) return 'Please select a valid timezone';
        return undefined;
      },
    };
    return validators[name]();
  };

  const validateForm = (): boolean => {
    const fields: (keyof ReminderFormState)[] = ['title', 'message', 'phone_number', 'date', 'time', 'timezone'];
    const newErrors: Partial<Record<keyof ReminderFormState, string>> = {};

    fields.forEach((field) => {
      newErrors[field] = validateField(field);
    });

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleFieldChange = (name: keyof ReminderFormState, value: ReminderFormState[keyof ReminderFormState]) => {
    const newFormData = { ...formData, [name]: value } as ReminderFormState;
    setFormData(newFormData);

    // Validate field if it has been touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, newFormData) }));
    }

    // Re-validate date/time if the other changes (they depend on each other)
    if (name === 'date' || name === 'time') {
      setErrors((prev) => ({
        ...prev,
        date: validateField('date', newFormData),
        time: validateField('time', newFormData),
      }));
    }
  };

  const handleBlur = (name: keyof ReminderFormState) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name) }));
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({
      title: true,
      message: true,
      phone_number: true,
      date: true,
      time: true,
      timezone: true,
    });

    if (!validateForm()) {
      return;
    }

    // Combine date and time in the selected timezone and convert to UTC
    const [hours, minutes] = formData.time.split(':').map(Number);

    // Get the date components as displayed in the UI
    const year = formData.date!.getFullYear();
    const month = String(formData.date!.getMonth() + 1).padStart(2, '0');
    const day = String(formData.date!.getDate()).padStart(2, '0');
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');

    // Create an ISO string without timezone info (YYYY-MM-DDTHH:mm:ss)
    // This represents the wall-clock time in the selected timezone
    const dateTimeStr = `${year}-${month}-${day}T${hoursStr}:${minutesStr}:00`;

    // Convert from the selected timezone to UTC
    // fromZonedTime interprets the ISO string as if it's in the given timezone
    const scheduled_time = fromZonedTime(dateTimeStr, formData.timezone);

    const reminderData: Partial<Reminder> = {
      ...(reminder?.id && { id: reminder.id }),
      title: formData.title.trim(),
      message: formData.message.trim(),
      phone_number: formData.phone_number,
      scheduled_time,
      timezone: formData.timezone,
    };

    onSave(reminderData);
  };

  const handleCancel = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditMode ? 'Edit Reminder' : 'Create Reminder'}
      size="lg"
      showCloseButton={!isSaving}
    >
      <div className="space-y-4">
        {/* Title */}
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          error={touched.title ? errors.title : undefined}
          placeholder="Enter reminder title"
          required
          disabled={isSaving}
        />

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
            Message
            <span className="ml-1 text-red-500">*</span>
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleFieldChange('message', e.target.value)}
            onBlur={() => handleBlur('message')}
            placeholder="Enter the message to be spoken during the call"
            rows={4}
            disabled={isSaving}
            className={`flex w-full rounded-md border ${
              touched.message && errors.message ? 'border-red-500' : 'border-gray-300'
            } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
              touched.message && errors.message
                ? 'focus:ring-red-500'
                : 'focus:ring-purple-600'
            } focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50`}
          />
          {touched.message && errors.message && (
            <p className="mt-1.5 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <PhoneNumberInput
          label="Phone Number"
          value={formData.phone_number}
          onChange={(value) => handleFieldChange('phone_number', value)}
          error={touched.phone_number ? errors.phone_number : undefined}
          required
          disabled={isSaving}
        />

        {/* Date and Time Row */}
        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(date) => handleFieldChange('date', date)}
            error={touched.date ? errors.date : undefined}
            required
            disabled={isSaving}
          />

          <div>
            <label htmlFor="time" className="mb-1.5 block text-sm font-medium text-gray-700">
              Time
              <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleFieldChange('time', e.target.value)}
              onBlur={() => handleBlur('time')}
              disabled={isSaving}
              className={`flex h-10 w-full rounded-md border ${
                touched.time && errors.time ? 'border-red-500' : 'border-gray-300'
              } bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                touched.time && errors.time
                  ? 'focus:ring-red-500'
                  : 'focus:ring-purple-600'
              } focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50`}
            />
            {touched.time && errors.time && (
              <p className="mt-1.5 text-sm text-red-600">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Timezone */}
        <TimezoneInput
          label="Timezone"
          value={formData.timezone}
          onChange={(value) => handleFieldChange('timezone', value)}
          error={touched.timezone ? errors.timezone : undefined}
          required
          disabled={isSaving}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
