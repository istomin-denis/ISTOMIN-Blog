# ISTOMIN Journal

A full-stack publishing platform for writing, discovering and discussing articles.

**Stack:** React · Vite · Node.js · Express · MongoDB · Mongoose · JWT · Docker

> Portfolio project. This is an independent implementation; it does not copy source files from the reference projects. AI assistance was used during initial scaffolding. Review, test and understand the code before presenting or extending it.

## Features

- Registration, login and logout with an HTTP-only session cookie.
- Protected routes and authenticated API endpoints.
- Create, read, update and delete articles.
- Ownership checks: only the author can edit or delete their article.
- Comments with author-only deletion.
- Search by title, excerpt and content.
- Tag filtering, popular tags and pagination.
- Optional cover image URL.
- Server-side validation with Zod.
- Password hashing with bcrypt.
- Helmet security headers, CORS allow-list and auth rate limiting.
- MongoDB persistence and Docker Compose environment.
- Health endpoint at `GET /api/health`.

## Structure

```text
istomin-blog/
├── client/                 # React + Vite application
│   ├── src/api/             # HTTP client
│   ├── src/components/      # Shared UI
│   ├── src/context/         # Authentication state
│   └── src/pages/           # Screens
├── server/                 # Express REST API
│   ├── src/config/
│   ├── src/controllers/
│   ├── src/middleware/
│   ├── src/models/
│   ├── src/routes/
│   └── src/utils/
├── docker-compose.yml
└── README.md
```

## Run locally

Requirements: Node.js 20+, npm and MongoDB 7+.

1. Install dependencies from the repository root: `npm install`.
2. Copy `server/.env.example` to `server/.env`.
3. Set a long random `JWT_SECRET` (at least 32 characters).
4. Start MongoDB locally.
5. Run `npm run dev`.
6. Open `http://localhost:5173`. The API runs at `http://localhost:4000`.

Frontend API URL can be overridden in `client/.env.local`:

```env
VITE_API_URL=http://localhost:4000/api
```

## Run with Docker

```bash
docker compose up --build
```

Open `http://localhost:5173`.

Before public deployment, replace the sample `JWT_SECRET`, configure `CLIENT_URL`, use HTTPS and review cookie settings. Do not use the included development configuration as a production security baseline.

## REST API

All routes are prefixed with `/api`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | API health |
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Start session |
| POST | `/auth/logout` | Public | Clear session |
| GET | `/auth/me` | Authenticated | Current user |
| GET | `/posts` | Public | List, search, filter and paginate |
| GET | `/posts/:slug` | Public | Get article and comments |
| GET | `/posts/by-id/:id` | Author | Load own article in editor |
| POST | `/posts` | Authenticated | Create article |
| PATCH | `/posts/:id` | Author | Update own article |
| DELETE | `/posts/:id` | Author | Delete own article |
| GET | `/posts/tags` | Public | Popular tags |
| POST | `/posts/:postId/comments` | Authenticated | Add comment |
| DELETE | `/comments/:id` | Comment author | Delete own comment |

## Security notes

- Passwords are hashed with bcrypt; plaintext passwords are never stored.
- Session tokens are issued in HTTP-only cookies.
- Authentication endpoints have rate limits.
- Request bodies are validated on the server.
- Article updates/deletes and comment deletion enforce ownership checks.
- Helmet sets common HTTP security headers.
- CORS is restricted to the configured frontend origin.
- Article content is rendered as text, not injected as raw HTML.

This is a learning/portfolio project, not a security-certified production platform. Before production, add CSRF protection appropriate to the deployment topology, email verification, password reset, audit logging, object storage for media, monitoring, backups and automated integration tests.

## Tests

```bash
npm test
```

The current test suite covers utility behaviour. Add integration tests for authentication, ownership checks and database-backed routes before production use.

## Attribution and project scope

This is an independent implementation built around a common MERN publishing-app feature set. The initial feature checklist was informed by these public examples:

- https://github.com/Archakov06/mern-blog-frontend
- https://github.com/Archakov06/mern-blog-backend

No source files, images or branding assets from those repositories are included. This project is not affiliated with the reference author. See `CREDITS.md`.

## Roadmap

- [ ] Integration tests for authentication and access-control rules.
- [ ] Markdown editor with safe rendering.
- [ ] Image upload to object storage.
- [ ] User profile pages.
- [ ] CI workflow for lint, tests and build.
- [ ] Deployment guide for hosted MongoDB and frontend/backend services.
