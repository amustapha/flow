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

export const reminderService = {
  /**
   * Create a new reminder
   */
  create: async (data: ReminderCreate): Promise<Reminder> => {
    return fetchApi<Reminder>('/api/v1/reminders/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all reminders with optional filtering and pagination
   */
  list: async (params?: {
    status?: string;
    date?: string;
    page?: number;
    page_size?: number;
  }): Promise<ReminderListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.date) searchParams.append('date', params.date);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());

    const query = searchParams.toString();
    const endpoint = `/api/v1/reminders/${query ? `?${query}` : ''}`;

    return fetchApi<ReminderListResponse>(endpoint);
  },

  /**
   * Get a single reminder by ID
   */
  get: async (id: string): Promise<Reminder> => {
    return fetchApi<Reminder>(`/api/v1/reminders/${id}`);
  },

  /**
   * Update a reminder
   */
  update: async (id: string, data: ReminderUpdate): Promise<Reminder> => {
    return fetchApi<Reminder>(`/api/v1/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a reminder
   */
  delete: async (id: string): Promise<void> => {
    return fetchApi<void>(`/api/v1/reminders/${id}`, {
      method: 'DELETE',
    });
  },
};

export const callService = {
  /**
   * Create a new call
   */
  create: async (data: CallCreate): Promise<Call> => {
    return fetchApi<Call>('/api/v1/calls/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all calls with optional filtering
   */
  list: async (params?: {
    reminder_id?: string;
    status?: string;
  }): Promise<CallWithReminder[]> => {
    const searchParams = new URLSearchParams();
    if (params?.reminder_id) searchParams.append('reminder_id', params.reminder_id);
    if (params?.status) searchParams.append('status', params.status);

    const query = searchParams.toString();
    const endpoint = `/api/v1/calls/${query ? `?${query}` : ''}`;

    return fetchApi<CallWithReminder[]>(endpoint);
  },

  /**
   * Get a single call by ID
   */
  get: async (id: string): Promise<CallWithReminder> => {
    return fetchApi<CallWithReminder>(`/api/v1/calls/${id}`);
  },

  /**
   * Update a call
   */
  update: async (id: string, data: CallUpdate): Promise<Call> => {
    return fetchApi<Call>(`/api/v1/calls/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export { ApiError };
