const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:8080';
const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT ?? '/auth/login';

export type LoginCredentials = { email: string; password: string };

export async function signIn(credentials: LoginCredentials): Promise<Response> {
  return fetch(`${API_GATEWAY_URL}${AUTH_ENDPOINT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}

export async function gatewayRequest(path: string, options: RequestInit = {}): Promise<Response> {
  const token = sessionStorage.getItem('agritech_access_token');
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_GATEWAY_URL}${path}`, { ...options, headers });
}
