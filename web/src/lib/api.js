const API_BASE = (
  import.meta.env.VITE_API_URL ||
  'https://nonenergetically-unwriggled-peg.ngrok-free.dev/api'
).replace(/\/$/, '');

async function parseJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function apiFetch(path, { method = 'GET', token, body, headers: extra = {} } = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...extra,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await parseJson(res);
  if (!res.ok) {
    const msg = (data && (data.erro || data.message)) || res.statusText;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const loginRequest = (email, senha) =>
  apiFetch('/usuarios/login', { method: 'POST', body: { email, senha } });
