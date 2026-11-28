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

The image builds the React app once and serves it with nginx. The browser
calls both backends **directly**, so the URLs in `.env` must be reachable from
the client, not just from this container. Values are injected into `/env.js`
at **container start**, so changing them needs no image rebuild.

### 1. Create `.env`

```sh
cp .env.example .env
```

| Variable | Meaning |
| --- | --- |
| `FRONTEND_PORT` | Host port that publishes this frontend (default `8088`) |
| `AUTH_API_URL` | Auth API base URL used by the browser; login POSTs to `<AUTH_API_URL>/login` |
| `AUTHORS_API_URL` | Authors API base URL used by the browser, **including `/api`**; the list is at `<AUTHORS_API_URL>/authors` |
| `USER_AUTH_REGISTER_URL` | Optional: where the Register link points. Derived from the hostname when unset |

For direct IP access:

```env
FRONTEND_PORT=8088
AUTH_API_URL=http://100.77.129.7:3002
AUTHORS_API_URL=http://100.77.129.7:8087/api
```

### 2. Configure CORS on the backends

These calls are cross-origin (different port or host). Add this frontend's
origin(s) to `CORS_ORIGIN` in `user-auth-node-mysql`'s `.env` (or `.env.docker`
on the server), then restart the auth container:

```env
CORS_ORIGIN=...existing...,http://100.77.129.7:8088,https://authors-example.abdullah-alaswad.link
```

The Authors API (Lumen) already sends `Access-Control-Allow-Origin: *` and
answers preflight requests, so it needs no change.

If this frontend is opened over HTTPS, both API URLs must be HTTPS too —
browsers block `http://` calls from an `https://` page as mixed content. Put
the backends behind the reverse proxy with TLS and use those HTTPS URLs.

### 3. Build and start

```sh
docker compose up -d --build
```

Then open `http://<server-ip>:8088` (or your domain).

### 4. Changing configuration later

Edit `.env` and recreate the container (no image rebuild needed):

```sh
docker compose up -d --force-recreate
```

### How authentication works

The login form POSTs directly to the auth backend (`user-auth-node-mysql`),
which checks the password against its MySQL `users` table and returns a JWT.
This app stores it in `localStorage` and publishes a host-scoped `jwt_token`
cookie. The Authors page sends it as `Authorization: Bearer <jwt>` to the
Authors API, which verifies the signature using the shared `JWT_SECRET`.

### Sharing the JWT with `user-auth-react`

The shared cookie is scoped to a **host**, not a port. Open both apps on the
same host, e.g. `http://<server-ip>:8083` and `http://<server-ip>:8088`. Do not
mix `localhost`, `127.0.0.1`, the LAN IP and the Tailscale IP — each is a
separate session. `localStorage` cannot be shared across ports, so this app
promotes the cookie into its own `localStorage` in `useToken.js`.

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
