'use client';

import { forwardRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { cn } from '@/lib/utils';

export interface Timezone {
  value: string;
  offset: string;
  label: string;
}

export const TIMEZONES: Timezone[] = [
  { value: 'Pacific/Pago_Pago', offset: 'UTC-11', label: '(UTC-11) Pago Pago' },
  { value: 'Pacific/Honolulu', offset: 'UTC-10', label: '(UTC-10) Hawaii' },
  { value: 'America/Anchorage', offset: 'UTC-9', label: '(UTC-9) Alaska' },
  { value: 'America/Los_Angeles', offset: 'UTC-8', label: '(UTC-8) Pacific Time' },
  { value: 'America/Denver', offset: 'UTC-7', label: '(UTC-7) Mountain Time' },
  { value: 'America/Chicago', offset: 'UTC-6', label: '(UTC-6) Central Time' },
  { value: 'America/New_York', offset: 'UTC-5', label: '(UTC-5) Eastern Time' },
  { value: 'America/Halifax', offset: 'UTC-4', label: '(UTC-4) Atlantic Time' },
  { value: 'America/St_Johns', offset: 'UTC-3:30', label: '(UTC-3:30) Newfoundland' },
  { value: 'America/Sao_Paulo', offset: 'UTC-3', label: '(UTC-3) São Paulo' },
  { value: 'Atlantic/South_Georgia', offset: 'UTC-2', label: '(UTC-2) South Georgia' },
  { value: 'Atlantic/Azores', offset: 'UTC-1', label: '(UTC-1) Azores' },
  { value: 'Europe/London', offset: 'UTC+0', label: '(UTC+0) London' },
  { value: 'Europe/Paris', offset: 'UTC+1', label: '(UTC+1) Paris' },
  { value: 'Europe/Berlin', offset: 'UTC+1', label: '(UTC+1) Berlin' },
  { value: 'Europe/Athens', offset: 'UTC+2', label: '(UTC+2) Athens' },
  { value: 'Africa/Cairo', offset: 'UTC+2', label: '(UTC+2) Cairo' },
  { value: 'Europe/Moscow', offset: 'UTC+3', label: '(UTC+3) Moscow' },
  { value: 'Asia/Dubai', offset: 'UTC+4', label: '(UTC+4) Dubai' },
  { value: 'Asia/Karachi', offset: 'UTC+5', label: '(UTC+5) Karachi' },
  { value: 'Asia/Kolkata', offset: 'UTC+5:30', label: '(UTC+5:30) Mumbai' },
  { value: 'Asia/Dhaka', offset: 'UTC+6', label: '(UTC+6) Dhaka' },
  { value: 'Asia/Bangkok', offset: 'UTC+7', label: '(UTC+7) Bangkok' },
  { value: 'Asia/Singapore', offset: 'UTC+8', label: '(UTC+8) Singapore' },
  { value: 'Asia/Shanghai', offset: 'UTC+8', label: '(UTC+8) Beijing' },
  { value: 'Asia/Tokyo', offset: 'UTC+9', label: '(UTC+9) Tokyo' },
  { value: 'Asia/Seoul', offset: 'UTC+9', label: '(UTC+9) Seoul' },
  { value: 'Australia/Sydney', offset: 'UTC+10', label: '(UTC+10) Sydney' },
  { value: 'Pacific/Noumea', offset: 'UTC+11', label: '(UTC+11) Noumea' },
  { value: 'Pacific/Auckland', offset: 'UTC+12', label: '(UTC+12) Auckland' },
  { value: 'Pacific/Fiji', offset: 'UTC+12', label: '(UTC+12) Fiji' },
];

export interface TimezoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

const TimezoneInput = forwardRef<HTMLSelectElement, TimezoneInputProps>(
  (
    {
      value = '',
      onChange,
      label,
      error,
      helperText,
      className,
      disabled = false,
      required = false,
      id,
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'timezone';

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(event.target.value);
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
        <div
          className={cn(
            'relative rounded-md',
            error && 'ring-2 ring-red-500'
          )}
        >
          <div className="grid grid-cols-1">
            <select
              ref={ref}
              id={inputId}
              name="timezone"
              value={value}
              onChange={handleChange}
              disabled={disabled}
              required={required}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
              className={cn(
                'col-start-1 row-start-1 w-full appearance-none rounded-md border bg-white',
                'py-2 pr-9 pl-3 text-sm text-gray-900',
                'focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
                error ? 'border-red-500' : 'border-gray-300',
                disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
              )}
            >
              <option value="">Select timezone...</option>
              {TIMEZONES.map((timezone) => (
                <option key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end text-gray-500"
            />
          </div>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TimezoneInput.displayName = 'TimezoneInput';

export { TimezoneInput };
