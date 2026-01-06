/**
 * Validates an E.164 formatted phone number
 * E.164 format: +[country code][subscriber number]
 * @param phoneNumber - The phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) {
    return false;
  }

  // E.164 format validation
  // Must start with +, followed by 1-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

/**
 * Validates that a date is in the future
 * @param date - The date to validate
 * @returns true if the date is in the future, false otherwise
 */
export function isFutureDate(date: Date): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();
  return date.getTime() > now.getTime();
}

/**
 * Validates a date and time combination is in the future (timezone-aware)
 * @param date - The date to validate (in the user's selected timezone)
 * @param time - The time string in HH:MM format (in the user's selected timezone)
 * @param timezone - The timezone to use for validation (defaults to system timezone)
 * @returns true if the combined date/time is in the future in the specified timezone
 */
export function isFutureDateTime(date: Date, time: string, timezone?: string): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }

  if (!time) {
    return false;
  }

  // Parse time string (HH:MM)
  const [hours, minutes] = time.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return false;
  }

  // Get the current time in the specified timezone
  const now = new Date();
  let currentTimeInZone: Date;

  if (timezone) {
    // Convert current UTC time to the specified timezone
    // This gives us what "now" is in the user's timezone
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(now);
      const getValue = (type: string) => parts.find(p => p.type === type)?.value || '0';

      currentTimeInZone = new Date(
        parseInt(getValue('year')),
        parseInt(getValue('month')) - 1,
        parseInt(getValue('day')),
        parseInt(getValue('hour')),
        parseInt(getValue('minute')),
        parseInt(getValue('second'))
      );
    } catch {
      // Fallback to system time if timezone is invalid
      currentTimeInZone = now;
    }
  } else {
    currentTimeInZone = now;
  }

  // Create the selected datetime in the same timezone representation
  const selectedDateTime = new Date(date);
  selectedDateTime.setHours(hours, minutes, 0, 0);

  return selectedDateTime.getTime() > currentTimeInZone.getTime();
}

/**
 * Validates that a string is not empty after trimming
 * @param value - The string to validate
 * @returns true if the string is not empty, false otherwise
 */
export function isNonEmptyString(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates a timezone string
 * @param timezone - The timezone string to validate
 * @returns true if the timezone is valid, false otherwise
 */
export function isValidTimezone(timezone: string): boolean {
  if (!timezone) {
    return false;
  }

  try {
    // Try to format a date with the timezone
    // If it throws, the timezone is invalid
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}
