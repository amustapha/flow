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
 * Validates a date and time combination is in the future
 * @param date - The date to validate
 * @param time - The time string in HH:MM format
 * @returns true if the combined date/time is in the future
 */
export function isFutureDateTime(date: Date, time: string): boolean {
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

  // Create a new date with the specified time
  const dateTime = new Date(date);
  dateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  return dateTime.getTime() > now.getTime();
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
