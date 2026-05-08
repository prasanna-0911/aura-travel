import { apiRequest, setStoredToken } from './apiClient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  preferences?: {
    favoriteDestinations: string[];
    experientialPreferences: string[];
  };
}

interface AuthResponse {
  success: boolean;
  user: AuthUser;
  token: string;
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('aura_user');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem('aura_user');
    return null;
  }
}

function persistAuth(response: AuthResponse) {
  setStoredToken(response.token);
  localStorage.setItem('aura_user', JSON.stringify(response.user));
  return response.user;
}

export async function login(email: string, password: string) {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  return persistAuth(response);
}

export async function register(name: string, email: string, password: string) {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });

  return persistAuth(response);
}

export async function fetchProfile() {
  const response = await apiRequest<{ success: boolean; user: AuthUser }>('/auth/profile');
  localStorage.setItem('aura_user', JSON.stringify(response.user));
  return response.user;
}

export async function updateProfile(updates: Partial<AuthUser>) {
  const response = await apiRequest<{ success: boolean; user: AuthUser }>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  localStorage.setItem('aura_user', JSON.stringify(response.user));
  return response.user;
}

export function logout() {
  setStoredToken(null);
  localStorage.removeItem('aura_user');
}
