import { toZonedTime } from 'date-fns-tz';

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
