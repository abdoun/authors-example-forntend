const COOKIE_NAME = 'jwt_token';
const DEFAULT_MAX_AGE = 3600;

function decodePayload(token) {
  try {
    const part = token.split('.')[1];
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  if (!token) return true;
  const payload = decodePayload(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

// Cookies are scoped to a host, not a port, so this is visible to the other
// localhost frontend (e.g. user-auth-react on port 3001).
export function publishSharedToken(token) {
  if (!token || isTokenExpired(token)) return;

  const payload = decodePayload(token);
  const maxAge = payload && payload.exp
    ? Math.max(1, payload.exp - Math.floor(Date.now() / 1000))
    : DEFAULT_MAX_AGE;

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function readSharedToken() {
  const prefix = `${COOKIE_NAME}=`;
  const entry = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}

export function clearSharedToken() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
