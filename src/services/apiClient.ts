const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getStoredToken() {
  return localStorage.getItem('aura_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('aura_token', token);
  } else {
    localStorage.removeItem('aura_token');
  }
}

export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function onOnlineStatusChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { timeout = 30000, retries = 1, ...fetchOptions } = options;
  const token = getStoredToken();
  const headers = new Headers(fetchOptions.headers);

  if (!headers.has('Content-Type') && fetchOptions.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${path}`;
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message = typeof payload === 'object' && payload && 'message' in payload
          ? String((payload as { message: unknown }).message)
          : `Request failed with status ${response.status}`;
        throw new ApiError(message, response.status, payload);
      }

      return payload as T;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error as Error;

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(`Request timed out after ${timeout}ms`, 408, null);
        }

        if (error instanceof ApiError) {
          if (attempt === retries) throw error;
          if (error.status >= 400 && error.status < 500) {
            throw error;
          }
        }
      }

      if (attempt === retries) {
        throw new ApiError(
          lastError instanceof Error ? lastError.message : 'Network request failed',
          lastError instanceof ApiError ? lastError.status : 0,
          lastError instanceof ApiError ? lastError.payload : null
        );
      }
    }
  }

  throw lastError;
}