#!/bin/sh
set -eu

# Defaults keep the image usable even without a .env file.
AUTH_API_URL="${AUTH_API_URL:-${REACT_APP_AUTH_API_URL:-/auth}}"
AUTHORS_API_URL="${AUTHORS_API_URL:-${REACT_APP_AUTHORS_API_URL:-/api}}"
AUTHORS_BACKEND_URL="${AUTHORS_BACKEND_URL:-http://authors-example-backend:8078}"
AUTH_BACKEND_URL="${AUTH_BACKEND_URL:-http://user-auth-api:3000}"
export AUTH_API_URL AUTHORS_API_URL AUTHORS_BACKEND_URL AUTH_BACKEND_URL

# Only substitute our own variables; nginx variables such as $uri, $host and
# $request_uri must be left untouched.
envsubst '${AUTH_API_URL} ${AUTHORS_API_URL}' \
  < /etc/nginx/app-templates/env.js.template \
  > /usr/share/nginx/html/env.js

envsubst '${AUTHORS_BACKEND_URL} ${AUTH_BACKEND_URL}' \
  < /etc/nginx/app-templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec "$@"
