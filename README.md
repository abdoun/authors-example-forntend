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
| `AUTH_API_URL` | Separate auth backend base URL seen by the browser (`POST /login`) | `http://localhost:3000` |

For this setup:

```env
FRONTEND_PORT=8088
AUTHORS_BACKEND_URL=http://authors-example-backend:8078
AUTHORS_API_URL=/api
AUTH_API_URL=http://<debian-server-ip>:<auth-backend-port>
```

### 2. Put the backend on the same network

A container name only resolves on a user-defined Docker network. Create the
network once and attach the already-running backend container to it:

```sh
docker network create authors-net
docker network connect authors-net authors-example-backend
```

If the backend is started by its own compose file, add this to it instead:

```yaml
networks:
  authors-net:
    external: true
```

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

### Why the `/api` proxy?

A browser cannot resolve `authors-example-backend`; that name only exists on
the Docker network. The app therefore calls the same-origin path
`/api/authors` and nginx forwards it to
`AUTHORS_BACKEND_URL/api/authors` (i.e. `http://authors-example-backend:8078/api/authors`).
This also avoids CORS for the authors API. To call the backend directly from
the browser instead, set `AUTHORS_API_URL` to a browser-resolvable URL ending
in `/api` (for example `http://<server-ip>:8078/api`) and enable CORS on the
backend. The separate auth backend is called directly by the browser, so it
must also be browser-reachable and allow CORS.

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
