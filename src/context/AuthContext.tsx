import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthUser,
  fetchProfile,
  getStoredUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateProfile
} from '@/services/authService';
import { getStoredToken } from '@/services/apiClient';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  saveProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      if (!getStoredToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await fetchProfile();
        if (mounted) setUser(profile);
      } catch {
        logoutRequest();
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    async login(email, password) {
      const nextUser = await loginRequest(email, password);
      setUser(nextUser);
    },
    async register(name, email, password) {
      const nextUser = await registerRequest(name, email, password);
      setUser(nextUser);
    },
    logout() {
      logoutRequest();
      setUser(null);
    },
    async refreshProfile() {
      const nextUser = await fetchProfile();
      setUser(nextUser);
    },
    async saveProfile(updates) {
      const nextUser = await updateProfile(updates);
      setUser(nextUser);
    }
  }), [isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
