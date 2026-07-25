import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { api, getToken, setToken, ApiError, type ApiUser } from '../lib/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  plan: 'personal' | 'corporate';
  is_admin: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string, plan: 'personal' | 'corporate') => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function mapUser(u: ApiUser): AuthUser {
  return { id: u.id, email: u.email, name: u.name, plan: u.plan, is_admin: u.is_admin };
}

function friendlyAuthError(message: string): string {
  if (message.includes('Invalid email or password')) return 'Invalid email or password.';
  if (message.includes('already exists')) return 'An account with this email already exists.';
  if (message.includes('at least')) return 'Password must be at least 6 characters.';
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!getToken()) {
        if (mounted) setInitialLoading(false);
        return;
      }
      try {
        const { user: u } = await api.me();
        if (mounted) setUser(mapUser(u));
      } catch {
        // Token expired or invalid — drop it silently.
        setToken(null);
      } finally {
        if (mounted) setInitialLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { token, user: u } = await api.signIn(email.trim().toLowerCase(), password);
      setToken(token);
      setUser(mapUser(u));
      setLoading(false);
      return true;
    } catch (e) {
      setError(friendlyAuthError(e instanceof ApiError ? e.message : 'Unable to sign in.'));
      setLoading(false);
      return false;
    }
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string, plan: 'personal' | 'corporate'): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const { token, user: u } = await api.signUp(name, email.trim().toLowerCase(), password, plan);
        setToken(token);
        setUser(mapUser(u));
        setLoading(false);
        return true;
      } catch (e) {
        setError(friendlyAuthError(e instanceof ApiError ? e.message : 'Unable to create account.'));
        setLoading(false);
        return false;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, initialLoading, error, signIn, signUp, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
