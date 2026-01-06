export interface Reminder {
  id: string;
  title: string;
  message: string;
  phone_number: string;
  scheduled_time: Date;
  timezone: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
}

export interface ReminderCreate {
  title: string;
  message: string;
  phone_number: string;
  scheduled_time: Date;
  timezone: string;
}

export interface ReminderUpdate {
  title?: string;
  message?: string;
  phone_number?: string;
  scheduled_time?: Date;
  timezone?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
}

// API response types (dates as strings from backend)
export interface ReminderResponse {
  id: string;
  title: string;
  message: string;
  phone_number: string;
  scheduled_time: string;
  timezone: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface ReminderListResponse {
  items: ReminderResponse[];
  total: number;
  page: number;
  page_size: number;
}
