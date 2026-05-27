/**
 * URL base da API (inclui /api).
 * Defina EXPO_PUBLIC_API_URL no .env (ex.: http://192.168.1.10:3000/api).
 * Por defeito usa o ngrok atual para facilitar web + mobile sem ajuste local.
 */
export function getApiBaseUrl() {
  const fromEnv =
    typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL;
  if (fromEnv) return String(fromEnv).replace(/\/$/, '');
  return `https://nonenergetically-unwriggled-peg.ngrok-free.dev/api`;
}
