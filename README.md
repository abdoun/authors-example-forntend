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

| Variable | Meaning | Default |
| --- | --- | --- |
| `FRONTEND_PORT` | Host port that publishes the frontend | `8088` |
| `AUTHORS_BACKEND_URL` | Authors backend address **inside** the Docker network, used by nginx | `http://authors-example-backend:8078` |
| `AUTHORS_API_URL` | Authors API base URL seen by the browser; `/api` uses the nginx proxy | `/api` |
| `AUTH_BACKEND_URL` | Auth backend address **inside** the Docker network, used by nginx | `http://user-auth-api:3000` |
| `AUTH_API_URL` | Auth API base URL seen by the browser; `/auth` uses the nginx proxy | `/auth` |

For this setup:

```env
FRONTEND_PORT=8088
AUTHORS_BACKEND_URL=http://authors-example-backend:8078
AUTHORS_API_URL=/api
AUTH_BACKEND_URL=http://user-auth-api:3000
AUTH_API_URL=/auth
```

### 2. Put both backends on shared networks

Container names only resolve on user-defined Docker networks. This compose
file joins two:

- `authors-net` — create it once and attach the authors backend to it:

  ```sh
  docker network create authors-net
  docker network connect authors-net authors-example-backend
  ```

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

### Why the `/api` and `/auth` proxies?

Browsers cannot resolve Docker container names; those names only exist on the
Docker network. The app therefore calls same-origin paths — `/api/authors` and
`/auth/login` — and nginx forwards them to `AUTHORS_BACKEND_URL` and
`AUTH_BACKEND_URL`. The `/auth` prefix is stripped upstream, so
`POST /auth/login` becomes `POST http://user-auth-api:3000/login`. This also
avoids CORS configuration for both APIs. To call a backend directly from the
browser instead, set its `*_API_URL` to a browser-resolvable URL and enable
CORS on that backend.

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
