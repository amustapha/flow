import {
  Reminder,
  ReminderCreate,
  ReminderUpdate,
  ReminderListResponse,
  Call,
  CallCreate,
  CallUpdate,
  CallWithReminder,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || 'An error occurred',
      response.status,
      errorData
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

/**
 * Base API service with generic CRUD operations
 */
class BaseApiService<TModel, TCreate, TUpdate> {
  constructor(protected endpoint: string) {}

  /**
   * Create a new resource
   */
  async create(data: TCreate): Promise<TModel> {
    return fetchApi<TModel>(`${this.endpoint}/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get a single resource by ID
   */
  async get(id: string): Promise<TModel> {
    return fetchApi<TModel>(`${this.endpoint}/${id}`);
  }

  /**
   * Update a resource
   */
  async update(id: string, data: TUpdate): Promise<TModel> {
    return fetchApi<TModel>(`${this.endpoint}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a resource
   */
  async delete(id: string): Promise<void> {
    return fetchApi<void>(`${this.endpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Build query string from params
   */
  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  }
}

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
    page?: number;
    page_size?: number;
  }): Promise<ReminderListResponse> {
    const query = params ? this.buildQueryString(params) : '';
    const endpoint = `${this.endpoint}/${query ? `?${query}` : ''}`;
    return fetchApi<ReminderListResponse>(endpoint);
  }
}

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

// Export service instances
export const reminderService = new ReminderService();
export const callService = new CallService();

export { ApiError };
