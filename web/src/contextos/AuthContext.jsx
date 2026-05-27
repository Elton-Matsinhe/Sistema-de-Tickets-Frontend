import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loginRequest } from '../lib/api.js';

const STORAGE_TOKEN = 'tickets_jwt';
const STORAGE_USER = 'tickets_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN));
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = useCallback(async (email, senha) => {
    const data = await loginRequest(email, senha);
    setToken(data.token);
    setUser(data.usuario);
    localStorage.setItem(STORAGE_TOKEN, data.token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(data.usuario));
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
  }, []);

  const value = useMemo(
    () => ({ token, user, login, logout, loading }),
    [token, user, login, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
