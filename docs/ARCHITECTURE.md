# Architecture

## Request flow

```text
React page
   │
   ▼
Axios client (credentials: include)
   │ HTTP / JSON + HTTP-only cookie
   ▼
Express app ── Helmet / CORS / JSON parser / cookie parser
   │
   ├── Auth routes ── Zod validation ── bcrypt / JWT
   ├── Post routes ── auth middleware ── ownership checks
   └── Comment routes ── auth middleware ── ownership checks
   │
   ▼
Controllers
   │
   ▼
Mongoose models
   │
   ▼
MongoDB
```

## Data model

- `User`: username, unique email, bcrypt password hash.
- `Post`: title, unique slug, excerpt, content, tags, cover URL, author reference, view count.
- `Comment`: text, post reference, author reference.

## Important design choices

- Password hashes are excluded from ordinary user queries.
- The session token is stored in an HTTP-only cookie rather than browser local storage.
- The API validates request bodies independently of browser-side validation.
- A post mutation checks the authenticated user's ID against the post's author ID.
- A comment deletion checks the authenticated user's ID against the comment's author ID.
- Article text is displayed as text. The client does not inject user-authored HTML into the DOM.

## Current limitations

- No CSRF token workflow yet. SameSite=Lax is a useful baseline, not a complete CSRF strategy for every deployment topology.
- No email verification, password reset, MFA or session revocation list.
- Cover images are external URLs; upload and storage are not implemented.
- No database-backed integration tests yet.
- No admin role or moderation workflow.
