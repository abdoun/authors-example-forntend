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
 * Where the "register" link points. Set USER_AUTH_REGISTER_URL in .env when
 * the companion app has its own hostname. The default is the app root: the
 * auth app's nginx proxies /register to its API, so the /register SPA route
 * is not reachable by direct URL. Its navbar has a Register link.
 */
function defaultRegisterUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8083/';
  }

  const { protocol, hostname } = window.location;
  const isIpOrLocal =
    hostname === 'localhost' || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);

  return isIpOrLocal
    ? `${protocol}//${hostname}:8083/`
    : `${protocol}//${hostname}/`;
}

export const REGISTER_URL =
  runtimeConfig.USER_AUTH_REGISTER_URL ||
  process.env.REACT_APP_USER_AUTH_REGISTER_URL ||
  defaultRegisterUrl();
