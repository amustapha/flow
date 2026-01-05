export interface Reminder {
  id: string;
  title: string;
  message: string;
  phoneNumber: string;
  scheduledTime: Date;
  timezone: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red';
}
