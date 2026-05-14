import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiRequest, getApiBaseUrl, getStoredToken, setStoredToken, ApiError } from '@/services/apiClient';

global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getApiBaseUrl', () => {
    it('should return default URL when no env var set', () => {
      expect(getApiBaseUrl()).toBe('http://localhost:5000/api');
    });
  });

  describe('getStoredToken', () => {
    it('should return null when no token stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      expect(getStoredToken()).toBeNull();
    });

    it('should return token when stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('test-token-123');
      expect(getStoredToken()).toBe('test-token-123');
    });
  });

  describe('setStoredToken', () => {
    it('should store token', () => {
      setStoredToken('new-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('aura_token', 'new-token');
    });

    it('should remove token when null', () => {
      setStoredToken(null);
      expect(localStorage.removeItem).toHaveBeenCalledWith('aura_token');
    });
  });

  describe('apiRequest', () => {
    it('should make GET request and return data', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true, data: 'test' })
      } as any);

      const result = await apiRequest('/test');

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual({ success: true, data: 'test' });
    });

    it('should include auth token when available', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('auth-token');
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true })
      } as any);

      await apiRequest('/protected');

      const call = (fetch as any).mock.calls[0];
      expect(call[0]).toContain('/protected');
      expect(call[1].headers.get('Authorization')).toBe('Bearer auth-token');
    });

    it('should throw ApiError on failed response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ message: 'Not found' })
      } as any);

      await expect(apiRequest('/notfound')).rejects.toThrow(ApiError);
    });

    it('should send JSON body with POST', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true })
      } as any);

      await apiRequest('/create', {
        method: 'POST',
        body: JSON.stringify({ name: 'test' })
      });

      const call = (fetch as any).mock.calls[0];
      expect(call[0]).toContain('/create');
      expect(call[1].method).toBe('POST');
      expect(call[1].headers.get('Content-Type')).toBe('application/json');
    });
  });
});

describe('ApiError', () => {
  it('should create error with status and payload', () => {
    const error = new ApiError('Test error', 500, { detail: 'Server error' });

    expect(error.message).toBe('Test error');
    expect(error.status).toBe(500);
    expect(error.payload).toEqual({ detail: 'Server error' });
    expect(error.name).toBe('ApiError');
  });
});