import { Reminder, ReminderStatus } from './reminder.types';

export interface Call {
  id: string;
  reminder_id: string;
  vapi_call_id?: string;
  status: ReminderStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CallCreate {
  reminder_id: string;
  vapi_call_id?: string;
  status?: ReminderStatus;
}

export interface CallUpdate {
  vapi_call_id?: string;
  status?: ReminderStatus;
}

export interface CallWithReminder extends Call {
  reminder: Reminder;
}
