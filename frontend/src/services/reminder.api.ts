import { Reminder, ReminderCreate, ReminderUpdate, ReminderListResponse } from '@/types';
import { BaseApiService, fetchApi } from './base.api';

/**
 * Reminder API service
 */
class ReminderService extends BaseApiService<Reminder, ReminderCreate, ReminderUpdate> {
  constructor() {
    super('/api/v1/reminders');
  }

  /**
   * Get all reminders with optional filtering and pagination
   */
  async list(params?: {
    status?: string;
    date?: string;
    timezone?: string;
    page?: number;
    page_size?: number;
  }): Promise<ReminderListResponse> {
    const query = params ? this.buildQueryString(params) : '';
    const endpoint = `${this.endpoint}/${query ? `?${query}` : ''}`;
    return fetchApi<ReminderListResponse>(endpoint);
  }
}

export const reminderService = new ReminderService();
