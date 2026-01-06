import { Call, CallCreate, CallUpdate, CallWithReminder } from '@/types';
import { BaseApiService, fetchApi } from './base.api';

/**
 * Call API service
 */
class CallService extends BaseApiService<Call, CallCreate, CallUpdate> {
  constructor() {
    super('/api/v1/calls');
  }

  /**
   * Get a single call by ID with reminder details
   */
  async get(id: string): Promise<CallWithReminder> {
    return fetchApi<CallWithReminder>(`${this.endpoint}/${id}`);
  }

  /**
   * Get all calls with optional filtering
   */
  async list(params?: {
    reminder_id?: string;
    status?: string;
  }): Promise<CallWithReminder[]> {
    const query = params ? this.buildQueryString(params) : '';
    const endpoint = `${this.endpoint}/${query ? `?${query}` : ''}`;
    return fetchApi<CallWithReminder[]>(endpoint);
  }
}

export const callService = new CallService();
