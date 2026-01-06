'use client';

import { forwardRef, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/16/solid';
import { cn } from '@/lib/utils';
import { COUNTRIES, Country } from '@/lib/constants';

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
 * Converts a country code to its flag emoji
 * Uses Regional Indicator Symbols to create flag emojis from ISO 3166-1 alpha-2 codes
 */
const countryCodeToFlag = (countryCode: string): string => {
  const REGIONAL_INDICATOR_BASE = 0x1f1e5;
  const ASCII_OFFSET = 65; // 'A' char code

  return countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(REGIONAL_INDICATOR_BASE + char.charCodeAt(0) - ASCII_OFFSET + 1))
    .join('');
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
    const [countryQuery, setCountryQuery] = useState('');
    const phoneInputRef = useRef<HTMLInputElement>(null);

    // Merge forwarded ref with internal ref
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        phoneInputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Filter countries based on search query
    const filteredCountries = useMemo(() => {
      if (!countryQuery) return COUNTRIES;
      const query = countryQuery.toLowerCase();
      return COUNTRIES.filter(
        (country) =>
          country.name.toLowerCase().includes(query) ||
          country.code.toLowerCase().includes(query) ||
          country.dialCode.includes(query)
      );
    }, [countryQuery]);

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'phone-number';

    // Initialize display value from E.164 value
    useEffect(() => {
      if (value) {
        const phoneNumber = extractPhoneNumber(value, selectedCountry.dialCode);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDisplayValue(formatPhoneNumber(phoneNumber, selectedCountry.format));
      } else {
        setDisplayValue('');
      }
    }, [value, selectedCountry]);

    const handleCountryChange = (country: Country | null) => {
      if (country) {
        setSelectedCountry(country);
        setCountryQuery('');

        // If there's a current value, update it with the new country code
        if (displayValue) {
          const digits = displayValue.replace(/\D/g, '');
          const e164Value = formatToE164(digits, country.dialCode);
          onChange?.(e164Value);
        }

        // Focus the phone input after selecting a country
        phoneInputRef.current?.focus();
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
          <Combobox
            value={selectedCountry}
            onChange={handleCountryChange}
            disabled={disabled}
          >
            <div className="relative shrink-0">
              <ComboboxInput
                id={`${inputId}-country`}
                aria-label="Country code"
                displayValue={(country: Country) => `${countryCodeToFlag(country.code)} ${country.dialCode}`}
                onChange={(e) => setCountryQuery(e.target.value)}
                onFocus={(e) => e.target.select()}
                className={cn(
                  'w-28 rounded-l-md bg-transparent border-r border-gray-300',
                  'py-2 pr-7 pl-3 text-sm text-gray-700',
                  'focus:outline-none',
                  disabled && 'cursor-not-allowed'
                )}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-4 text-gray-500"
                />
              </ComboboxButton>
              <ComboboxOptions
                className="absolute z-50 mt-1 max-h-60 w-72 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                {filteredCountries.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500">No countries found</div>
                ) : (
                  filteredCountries.map((country) => (
                    <ComboboxOption
                      key={country.code}
                      value={country}
                      className="group relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-focus:bg-purple-100 data-selected:font-medium"
                    >
                      <span className="block truncate">
                        {countryCodeToFlag(country.code)} {country.name} {country.dialCode}
                      </span>
                      <span className="absolute inset-y-0 left-0 hidden items-center pl-3 text-purple-600 group-data-selected:flex">
                        <CheckIcon className="size-4" aria-hidden="true" />
                      </span>
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </div>
          </Combobox>
          <input
            ref={setRefs}
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

export { PhoneNumberInput };
export { COUNTRIES, type Country } from '@/lib/constants';
