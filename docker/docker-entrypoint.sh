#!/bin/sh
set -eu

# CRA bakes REACT_APP_* values into the bundle at build time, so generate
# env.js from the container environment on every start instead.
AUTH_API_URL="${AUTH_API_URL:-${REACT_APP_AUTH_API_URL:-http://localhost:3002}}"
AUTHORS_API_URL="${AUTHORS_API_URL:-${REACT_APP_AUTHORS_API_URL:-http://localhost:8087/api}}"
USER_AUTH_REGISTER_URL="${USER_AUTH_REGISTER_URL:-${REACT_APP_USER_AUTH_REGISTER_URL:-}}"
export AUTH_API_URL AUTHORS_API_URL USER_AUTH_REGISTER_URL

envsubst '${AUTH_API_URL} ${AUTHORS_API_URL} ${USER_AUTH_REGISTER_URL}' \
  < /etc/nginx/app-templates/env.js.template \
  > /usr/share/nginx/html/env.js

exec "$@"
