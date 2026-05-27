import { getApiBaseUrl } from '../config/apiBase.js';

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function apiFetch(path, { method = 'GET', token, body } = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const msg =
      (data && (data.erro || data.message)) || res.statusText || 'Erro na API';
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const loginApi = (email, senha) =>
  apiFetch('/usuarios/login', { method: 'POST', body: { email, senha } });

export const fetchTickets = (token) => apiFetch('/tickets', { token });

export const fetchFormData = (token) =>
  apiFetch('/tickets/dados-formulario', { token });

export const createTicketApi = (token, payload) =>
  apiFetch('/tickets', { method: 'POST', token, body: payload });

export const alocarTicketApi = (token, id, atribuido_para) =>
  apiFetch(`/tickets/${id}/alocar`, {
    method: 'PATCH',
    token,
    body: { atribuido_para },
  });

export const fecharTicketApi = (token, id) =>
  apiFetch(`/tickets/${id}/fechar`, { method: 'PATCH', token });

export const deleteTicketApi = (token, id) =>
  apiFetch(`/tickets/${id}`, { method: 'DELETE', token });

export const fetchDashboardStats = (token, query = '') =>
  apiFetch(`/dashboard/estatisticas${query}`, { token });
