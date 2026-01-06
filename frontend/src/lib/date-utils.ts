import { toZonedTime } from 'date-fns-tz';

/**
 * Parse a date string from the API ensuring it's treated as UTC.
 * Appends 'Z' suffix if missing to ensure proper UTC parsing.
 * @param dateString - The date string to parse (can be string or Date)
 * @returns A Date object representing the UTC time
 */
export const parseUTCDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) {
    return dateString;
  }
  const normalizedString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
  return new Date(normalizedString);
};

/**
 * Safely parse an optional date string from the API.
 * Returns undefined if the input is null/undefined.
 * @param dateString - The optional date string to parse
 * @returns A Date object or undefined
 */
export const parseOptionalUTCDate = (
  dateString: string | Date | null | undefined
): Date | undefined => {
  if (dateString == null) {
    return undefined;
  }
  return parseUTCDate(dateString);
};

/**
 * Check if two dates represent the same calendar day
 * (ignoring time components)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Check if a date is today (in the local timezone)
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Check if a date is today in a specific timezone
 */
export const isTodayInTimezone = (date: Date, timezone: string): boolean => {
  const todayInZone = toZonedTime(new Date(), timezone);
  return isSameDay(date, todayInZone);
};
