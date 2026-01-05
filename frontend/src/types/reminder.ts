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

export interface ReminderListResponse {
  items: Reminder[];
  total: number;
  page: number;
  page_size: number;
}
