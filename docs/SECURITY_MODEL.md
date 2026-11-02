# Security model and test plan

This document describes the intended trust boundaries and a practical checklist for reviewing the application. Test only local instances or systems for which you have explicit permission.

## Assets

- User credentials and session cookies.
- Private article-edit and delete operations.
- Comment ownership.
- Article and comment content.
- MongoDB availability and integrity.

## Trust boundaries

1. Browser to API: all input is untrusted, even when client-side forms validate it.
2. API to database: controllers validate and normalize user-controlled fields before persistence.
3. Authenticated user to resource: authentication does not imply ownership of every resource.

## Access-control matrix

| Action | Anonymous | Authenticated non-owner | Resource owner |
|---|---:|---:|---:|
| Read published article | Allow | Allow | Allow |
| Create article | Deny | Allow | Allow |
| Edit article | Deny | Deny | Allow |
| Delete article | Deny | Deny | Allow |
| Add comment | Deny | Allow | Allow |
| Delete own comment | Deny | Allow | Allow |
| Delete another user's comment | Deny | Deny | Deny |

## Manual security test checklist

Use two test accounts, Alice and Bob, and create resources owned by each account.

- [ ] Unauthenticated requests to `POST /api/posts` return 401.
- [ ] Alice cannot PATCH a post owned by Bob (expect 403).
- [ ] Alice cannot DELETE a post owned by Bob (expect 403).
- [ ] Alice cannot DELETE a comment owned by Bob (expect 403).
- [ ] Unknown or expired session cookies do not authenticate.
- [ ] Invalid post fields are rejected server-side.
- [ ] Passwords are not returned by `/api/auth/me`.
- [ ] Repeated login attempts are rate-limited.
- [ ] Article content containing HTML is displayed as text, not executed.
- [ ] CORS does not allow an arbitrary origin with credentials.

## Findings template

| Field | Value |
|---|---|
| Test ID | e.g. AC-01 |
| Endpoint | HTTP method and path |
| Preconditions | Accounts, roles and resource ownership |
| Steps | Reproducible request sequence |
| Expected result | Correct access decision |
| Actual result | Observed response |
| Severity | Informational / Low / Medium / High / Critical |
| Evidence | Sanitized request and response |
| Recommendation | Specific remediation |

Do not report an issue as a vulnerability until it is reproducible and its security impact is understood.
