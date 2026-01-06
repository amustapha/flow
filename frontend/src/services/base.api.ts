const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
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
export class BaseApiService<TModel, TCreate, TUpdate> {
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
