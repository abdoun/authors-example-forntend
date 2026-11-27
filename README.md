# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Authentication

Login is handled by the separate auth backend (`user-auth-node-mysql`): this
app POSTs credentials to `<REACT_APP_AUTH_API_URL>/login`, stores the returned
JWT in `localStorage.token`, and sends it as `Authorization: Bearer <jwt>` to
the authors API.

The JWT is also published in a `jwt_token` cookie scoped to `localhost`, so it
is shared with `user-auth-react` on `localhost:3001`: logging in at either app
signs you in to the other, and logging out at either app clears both. Open both
apps via `localhost` (not `127.0.0.1`), since cookies are host-specific.

Set `REACT_APP_AUTH_API_URL` in a `.env` file (or your build environment) to
the auth backend base URL for local development. It defaults to
`http://localhost:3000`. In Docker, use `AUTH_API_URL` in `.env` instead (see
below).

## Docker deployment (Debian server)

The image builds the React app once and serves it with nginx. API URLs come
from a `.env` file at **container start**, so changing them does not require
rebuilding the image.

### 1. Create `.env`

```sh
cp .env.example .env
```

Only one setting is required:

| Variable | Meaning | Default |
| --- | --- | --- |
| `FRONTEND_PORT` | Host port that publishes the frontend | `8088` |

The rest are optional overrides:

| Variable | Meaning | Default |
| --- | --- | --- |
| `AUTHORS_BACKEND_URL` | Address nginx forwards `/api/*` to — Docker name, LAN/Tailscale IP or public host | `http://authors-api:80` |
| `AUTH_BACKEND_URL` | Address nginx forwards `/auth/*` to | `http://user-auth-api:3000` |
| `AUTHORS_API_URL` | Advanced: browser-facing path for the authors API | `/api` |
| `AUTH_API_URL` | Advanced: browser-facing path for the auth API | `/auth` |

For this setup:

```env
FRONTEND_PORT=8088
```

### 2. Put both backends on shared networks

Container names only resolve on user-defined Docker networks. This compose
file joins two:

- `authors-net` — declared `external: true`, so create it once and attach the
  authors backend to it:

  ```sh
  docker network create authors-net
  docker network connect authors-net authors-api
  ```

  The backend container is named `authors-api` and Apache listens on port
  `80` inside it, so the default upstream is `http://authors-api:80`. Port
  `8087` is only the host-published port (Apache listens on `80` inside).

- `user-auth-node-mysql_user-auth-network` — created by the
  `user-auth-node-mysql` stack and shared with `user-auth-react`. It must
  already exist before starting this stack (declared `external: true`).
  `AUTH_BACKEND_URL` defaults to `http://user-auth-api:3000`, which is the
  auth API container on that network.

If a backend is managed by its own compose file, declare the network there as
`external: true` with the same `name` instead of connecting the container
manually.

### 3. Build and start

```sh
docker compose up -d --build
```

Then open `http://<debian-server-ip>:8088`.

### 4. Changing configuration later

Edit `.env` and recreate the container (no image rebuild needed):

```sh
docker compose up -d --force-recreate
```

### Why not just use port 8087?

`8087` (and the auth API's `3002`) are **host-published** ports — that's how a
browser reaches a backend from Tailscale, the home LAN or the internet. From
*inside* this frontend container, `localhost:8087` would mean the frontend
container itself, not the backend. nginx needs the backend's actual address,
so `AUTHORS_BACKEND_URL` accepts any address the **server** can reach:

```env
AUTHORS_BACKEND_URL=http://authors-api:80          # Docker network (default)
AUTHORS_BACKEND_URL=http://100.x.y.z:8087          # Tailscale IP
AUTHORS_BACKEND_URL=http://192.168.1.50:8087       # home LAN
AUTHORS_BACKEND_URL=https://api.example.com        # public host
```

The same applies to `AUTH_BACKEND_URL`, e.g. `http://100.x.y.z:3002`.

The browser still calls same-origin paths — `/api/authors` and `/auth/login`
on port 8088 — and nginx forwards them to those addresses. The `/auth` prefix
is stripped upstream, so `POST /auth/login` becomes
`POST http://user-auth-api:3000/login`. Calling `http://<ip>:8087/api/authors`
directly from the browser would be cross-origin from `:8088`, and the Lumen
authors API sends no CORS headers, so the browser would block it. The proxy
avoids that. The auth API does support CORS via `CORS_ORIGIN`, but the proxy
means you don't have to configure it.

### Sharing the JWT with `user-auth-react`

No extra network is needed for this: the token is shared through the
`jwt_token` cookie, which is scoped to a **host**, not a port. Open both apps
using the same host — `http://<server-ip>:8083` for `user-auth-react` and
`http://<server-ip>:8088` for this app. Do not mix `localhost`, `127.0.0.1` and
the server IP. Logging in on either app then signs you in to the other, and
logging out on either clears both. `localStorage` is origin-scoped and cannot
be shared across ports, so this app promotes the cookie into its own
`localStorage` in `useToken.js`.

### Useful commands

```sh
docker compose logs -f authors-example-frontend
docker compose ps
docker compose down
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
