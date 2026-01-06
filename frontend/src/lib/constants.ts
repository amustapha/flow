export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const DAY_NAMES_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const;

export const DAY_NAMES_ABBREV = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

/**
 * Reminder time thresholds in minutes for visual styling
 */
export const REMINDER_THRESHOLDS = {
  /** Minutes after scheduled time before reminder is considered "past" */
  PAST_GRACE_PERIOD: -5,
  /** Minutes before scheduled time when reminder is considered "upcoming" */
  UPCOMING_WINDOW: 15,
} as const;

/**
 * Time grid settings for calendar view
 */
export const TIME_GRID = {
  /** Interval in minutes for time slot snapping */
  SNAP_INTERVAL_MINUTES: 15,
} as const;
