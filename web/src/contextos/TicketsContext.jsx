import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiFetch } from '../lib/api.js';
import { mapApiTicketToWeb } from '../lib/ticketMap.js';
import { useAuth } from './AuthContext.jsx';

const TicketsContext = createContext(null);

export function TicketsProvider({ children }) {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!token) {
      setTickets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch('/tickets', { token });
      setTickets(Array.isArray(data) ? data.map(mapApiTicketToWeb) : []);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ tickets, setTickets, loading, error, refresh }),
    [tickets, loading, error, refresh]
  );

  return (
    <TicketsContext.Provider value={value}>{children}</TicketsContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error('useTickets deve ser usado dentro de TicketsProvider');
  return ctx;
}
