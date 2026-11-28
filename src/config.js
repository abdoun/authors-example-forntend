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

// Both URLs are used by the browser directly, so they must be reachable from
// wherever the app is opened (and use the same scheme as the page — otherwise
// the browser blocks them as mixed content). Set them in .env for Docker.
export const AUTH_API_URL = withoutTrailingSlash(
  runtimeConfig.AUTH_API_URL ||
    process.env.REACT_APP_AUTH_API_URL ||
    'http://localhost:3002'
);

// Base URL of the authors API, including its `/api` prefix.
export const AUTHORS_API_URL = withoutTrailingSlash(
  runtimeConfig.AUTHORS_API_URL ||
    process.env.REACT_APP_AUTHORS_API_URL ||
    'http://localhost:8087/api'
);

export const authorsEndpoint = () => `${AUTHORS_API_URL}/authors`;

/**
 * Where the "register" link points. Set USER_AUTH_REGISTER_URL in .env when
 * the companion app uses a different hostname than the one derived here.
 * Without it, IP/localhost visitors get the direct 8083 URL, and
 * authors-example.<domain> visitors get auth.<domain>/register.
 */
function defaultRegisterUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8083/register';
  }

  const { protocol, hostname } = window.location;
  const isIpOrLocal =
    hostname === 'localhost' || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);

  if (isIpOrLocal) {
    return `${protocol}//${hostname}:8083/register`;
  }

  const prefix = 'authors-example.';
  const authHost = hostname.startsWith(prefix)
    ? `auth.${hostname.slice(prefix.length)}`
    : hostname;

  return `${protocol}//${authHost}/register`;
}

export const REGISTER_URL =
  runtimeConfig.USER_AUTH_REGISTER_URL ||
  process.env.REACT_APP_USER_AUTH_REGISTER_URL ||
  defaultRegisterUrl();
