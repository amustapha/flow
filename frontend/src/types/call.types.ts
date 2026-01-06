import { Reminder } from './reminder';

export interface Call {
  id: string;
  reminder_id: string;
  vapi_call_id?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface CallCreate {
  reminder_id: string;
  vapi_call_id?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
}

export interface CallUpdate {
  vapi_call_id?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
}

export interface CallWithReminder extends Call {
  reminder: Reminder;
}
