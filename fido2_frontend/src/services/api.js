/// API client for backend integration using REACT_APP_API_BASE_URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Internal helper to build full URL.
 * @param {string} path path beginning with /
 */
function buildUrl(path) {
  if (!BASE_URL) {
    // Note: The environment variable must be provided at runtime via .env
    // We avoid throwing to keep UI functional offline, but log clearly.
    console.warn('REACT_APP_API_BASE_URL is not set. Requests will likely fail.');
  }
  const root = BASE_URL?.replace(/\/+$/, '') || '';
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${root}${p}`;
}

/**
 * Executes a request returning JSON or throws Error with response info.
 * @param {string} path endpoint path
 * @param {RequestInit} options fetch options
 * @returns {Promise<any>}
 */
async function request(path, options = {}) {
  const resp = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await resp.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!resp.ok) {
    const message = (data && (data.message || data.error)) || `HTTP ${resp.status}`;
    const err = new Error(message);
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function apiGet(path) {
  /** Performs a GET request to backend. */
  return request(path, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function apiPost(path, body) {
  /** Performs a POST request to backend with JSON body. */
  return request(path, { method: 'POST', body: JSON.stringify(body || {}) });
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
  /** Performs a DELETE request to backend. */
  return request(path, { method: 'DELETE' });
}

// Example endpoints (these may need to align with backend actual paths):
// PUBLIC_INTERFACE
export const Api = {
  /** Auth and WebAuthn endpoints - adjust paths to backend API spec when available. */
  beginRegistration: (username, displayName) => apiPost('/webauthn/register/begin', { username, displayName }),
  finishRegistration: (attestationResponse) => apiPost('/webauthn/register/finish', attestationResponse),

  beginLogin: (username) => apiPost('/webauthn/login/begin', { username }),
  finishLogin: (assertionResponse) => apiPost('/webauthn/login/finish', assertionResponse),

  qrStart: () => apiGet('/qr/start'),
  qrStatus: (token) => apiGet(`/qr/status?token=${encodeURIComponent(token)}`),

  me: () => apiGet('/users/me'),
  users: () => apiGet('/users'),
  toggleUser: (userId, enabled) => apiPost(`/users/${userId}/toggle`, { enabled }),
};

export default Api;
