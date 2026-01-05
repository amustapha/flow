'use client';

import { forwardRef, useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { cn } from '@/lib/utils';

export interface Country {
  code: string;
  dialCode: string;
  name: string;
  format?: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', dialCode: '+1', name: 'United States', format: '(###) ###-####' },
  { code: 'CA', dialCode: '+1', name: 'Canada', format: '(###) ###-####' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', format: '#### ### ####' },
  { code: 'AU', dialCode: '+61', name: 'Australia', format: '#### ### ###' },
  { code: 'DE', dialCode: '+49', name: 'Germany', format: '### ########' },
  { code: 'FR', dialCode: '+33', name: 'France', format: '# ## ## ## ##' },
  { code: 'IN', dialCode: '+91', name: 'India', format: '##### #####' },
  { code: 'JP', dialCode: '+81', name: 'Japan', format: '##-####-####' },
  { code: 'BR', dialCode: '+55', name: 'Brazil', format: '(##) #####-####' },
  { code: 'MX', dialCode: '+52', name: 'Mexico', format: '### ### ####' },
];

export interface PhoneNumberInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  defaultCountry?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

/**
 * Formats a phone number according to E.164 format
 * E.164 format: +[country code][subscriber number]
 */
const formatToE164 = (phoneNumber: string, dialCode: string): string => {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  // If the number already starts with the dial code (without +), just add +
  if (digits.startsWith(dialCode.substring(1))) {
    return `+${digits}`;
  }

  // Otherwise, prepend the dial code
  return `${dialCode}${digits}`;
};

/**
 * Formats a phone number for display based on the country format
 */
const formatPhoneNumber = (value: string, format?: string): string => {
  if (!format) return value;

  const digits = value.replace(/\D/g, '');
  let formatted = '';
  let digitIndex = 0;

  for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
    if (format[i] === '#') {
      formatted += digits[digitIndex];
      digitIndex++;
    } else {
      formatted += format[i];
    }
  }

  // Add remaining digits if any
  formatted += digits.substring(digitIndex);

  return formatted;
};

/**
 * Extracts the phone number from E.164 format for display
 */
const extractPhoneNumber = (e164Value: string, dialCode: string): string => {
  if (!e164Value) return '';

  // Remove the dial code from the beginning
  if (e164Value.startsWith(dialCode)) {
    return e164Value.substring(dialCode.length);
  }

  return e164Value.replace(/^\+/, '');
};

const PhoneNumberInput = forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  (
    {
      value = '',
      onChange,
      label,
      error,
      helperText,
      placeholder = '(123) 456-7890',
      defaultCountry = 'US',
      className,
      disabled = false,
      required = false,
      id,
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = useState<Country>(
      COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
    );
    const [displayValue, setDisplayValue] = useState('');

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'phone-number';

    // Initialize display value from E.164 value
    useEffect(() => {
      if (value) {
        const phoneNumber = extractPhoneNumber(value, selectedCountry.dialCode);
        setDisplayValue(formatPhoneNumber(phoneNumber, selectedCountry.format));
      } else {
        setDisplayValue('');
      }
    }, [value, selectedCountry]);

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const country = COUNTRIES.find((c) => c.code === event.target.value);
      if (country) {
        setSelectedCountry(country);

        // If there's a current value, update it with the new country code
        if (displayValue) {
          const digits = displayValue.replace(/\D/g, '');
          const e164Value = formatToE164(digits, country.dialCode);
          onChange?.(e164Value);
        }
      }
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      const digits = input.replace(/\D/g, '');

      // Format for display
      const formatted = formatPhoneNumber(digits, selectedCountry.format);
      setDisplayValue(formatted);

      // Convert to E.164 and call onChange
      const e164Value = formatToE164(digits, selectedCountry.dialCode);
      onChange?.(e164Value);
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
            'flex rounded-md border bg-white',
            'focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-transparent',
            error ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
          )}
        >
          <div className="grid shrink-0 grid-cols-1 focus-within:relative">
            <select
              id={`${inputId}-country`}
              name="country"
              value={selectedCountry.code}
              onChange={handleCountryChange}
              disabled={disabled}
              aria-label="Country code"
              className={cn(
                'col-start-1 row-start-1 w-full appearance-none rounded-l-md bg-transparent',
                'py-2 pr-7 pl-3 text-sm text-gray-700',
                'focus:outline-none',
                disabled && 'cursor-not-allowed'
              )}
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} {country.dialCode}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end text-gray-500"
            />
          </div>
          <input
            ref={ref}
            id={inputId}
            name="phone-number"
            type="tel"
            value={displayValue}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              'block min-w-0 grow bg-transparent py-2 pr-3 pl-2 text-sm text-gray-900',
              'placeholder:text-gray-400',
              'focus:outline-none',
              disabled && 'cursor-not-allowed'
            )}
          />
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

PhoneNumberInput.displayName = 'PhoneNumberInput';

export { PhoneNumberInput, COUNTRIES };
