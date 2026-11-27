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
