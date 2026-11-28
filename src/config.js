/**
 * Runtime configuration.
 *
 * In Docker, /env.js is generated from the container environment when the
 * container starts (see docker/docker-entrypoint.sh) and is loaded by
 * public/index.html before the app bundle. Locally, public/env.js is a
 * placeholder and the usual REACT_APP_* / default values are used instead.
 */
const runtimeConfig =
  typeof window !== 'undefined' && window.__APP_CONFIG__
    ? window.__APP_CONFIG__
    : {};

const withoutTrailingSlash = (value) => String(value).replace(/\/+$/, '');

export const AUTH_API_URL = withoutTrailingSlash(
  runtimeConfig.AUTH_API_URL ||
    process.env.REACT_APP_AUTH_API_URL ||
    'http://localhost:3000'
);

// Base URL of the authors API, including its `/api` prefix.
export const AUTHORS_API_URL = withoutTrailingSlash(
  runtimeConfig.AUTHORS_API_URL ||
    process.env.REACT_APP_AUTHORS_API_URL ||
    'http://authors-backend/api'
);

export const authorsEndpoint = () => `${AUTHORS_API_URL}/authors`;

/**
 * Base URL of the companion user-auth-react frontend, which owns sign-in,
 * sign-out, registration and profile pages. Set USER_AUTH_URL in .env when
 * it lives somewhere other than the derived default:
 *   IP/localhost -> http://<same-host>:8083
 *   authors-example.<domain> -> <scheme>://auth.<domain>
 */
function defaultAuthAppUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8083';
  }

  const { protocol, hostname } = window.location;
  const isIpOrLocal =
    hostname === 'localhost' || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);

  if (isIpOrLocal) {
    return `http://${hostname}:8083`;
  }

  const prefix = 'authors-example.';
  const authHost = hostname.startsWith(prefix)
    ? `auth.${hostname.slice(prefix.length)}`
    : hostname;

  return `${protocol}//${authHost}`;
}

export const USER_AUTH_URL = withoutTrailingSlash(
  runtimeConfig.USER_AUTH_URL ||
    process.env.REACT_APP_USER_AUTH_URL ||
    defaultAuthAppUrl()
);

// Override with USER_AUTH_REGISTER_URL in .env if the register page uses a
// different host/path than <USER_AUTH_URL>/register.
export const REGISTER_URL = withoutTrailingSlash(
  runtimeConfig.USER_AUTH_REGISTER_URL ||
    process.env.REACT_APP_USER_AUTH_REGISTER_URL ||
    `${USER_AUTH_URL}/register`
);
