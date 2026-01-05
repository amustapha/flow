'use client';

import { useState, forwardRef } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Calendar } from './Calendar';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  /**
   * The selected date value
   */
  value?: Date;
  /**
   * Callback when date is selected
   */
  onChange?: (date: Date) => void;
  /**
   * Optional label for the date picker
   */
  label?: string;
  /**
   * Optional error message
   */
  error?: string;
  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;
  /**
   * Whether the date picker is disabled
   */
  disabled?: boolean;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Optional ID for the input
   */
  id?: string;
}

const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      placeholder = 'Select a date',
      disabled = false,
      required = false,
      className,
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const formatDate = (date: Date | undefined): string => {
      if (!date) return '';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const handleDateSelect = (date: Date) => {
      onChange?.(date);
      setIsOpen(false);
    };

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <Popover>
          {({ open }) => (
            <>
              <PopoverButton
                ref={ref}
                id={inputId}
                disabled={disabled}
                className={cn(
                  'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  error && 'border-red-500 focus:ring-red-500',
                  !value && 'text-gray-400'
                )}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${inputId}-error` : undefined}
                aria-required={required}
              >
                <span>{value ? formatDate(value) : placeholder}</span>
                <CalendarIcon className="h-4 w-4 text-gray-500" />
              </PopoverButton>
              <PopoverPanel
                anchor="bottom start"
                className="z-10 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
              >
                <Calendar
                  initialDate={value}
                  onDateSelect={handleDateSelect}
                />
              </PopoverPanel>
            </>
          )}
        </Popover>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
